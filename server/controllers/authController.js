const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, FinancialProfile, Subscription, Gamification } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'owesmart-secret-key-change-in-production';

// Register new user
exports.register = async (req, res) => {
  try {
    console.log('📝 Registration attempt:', { email: req.body.email, name: req.body.name });
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      console.log('❌ User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    console.log('✅ User created:', { id: user.id, email: user.email });

    // Create financial profile
    await FinancialProfile.create({ userId: user.id });

    // Create default subscription (OweSmart tier)
    await Subscription.create({
      userId: user.id,
      tier: 'OweSmart',
      price: 19.90,
      status: 'active',
      startDate: new Date(),
      features: {
        dashboard: true,
        aiRecommendations: true,
        gamification: true,
        consolidation: true,
        creditReporting: false
      }
    });

    // Create gamification profile
    await Gamification.create({
      userId: user.id,
      points: 0,
      level: 1,
      streak: 0,
      achievements: [],
      milestones: {}
    });

    // Generate token
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

    console.log('✅ Registration successful for:', email);
    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('❌ Register error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    console.log('🔑 Login attempt:', { email: req.body.email });
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('❌ Invalid password for:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

    console.log('✅ Login successful for:', email);
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get current user
exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: ['id', 'name', 'email']
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Google OAuth authentication
exports.googleAuth = async (req, res) => {
  try {
    const { uid, email, displayName, photoURL, emailVerified } = req.body;

    // Validate required fields
    if (!uid || !email) {
      return res.status(400).json({ message: 'Missing required fields: uid and email' });
    }

    // Check if user exists with this Google ID
    let user = await User.findOne({ where: { googleId: uid } });

    if (user) {
      // User exists, update their info
      await user.update({
        name: displayName || user.name,
        photoURL: photoURL || user.photoURL,
        emailVerified: emailVerified !== undefined ? emailVerified : user.emailVerified
      });
    } else {
      // Check if user exists with this email (linking existing account)
      user = await User.findOne({ where: { email } });

      if (user) {
        // Link Google account to existing user
        await user.update({
          googleId: uid,
          authProvider: 'google',
          photoURL: photoURL || user.photoURL,
          emailVerified: emailVerified !== undefined ? emailVerified : user.emailVerified
        });
      } else {
        // Create new user
        user = await User.create({
          name: displayName || 'User',
          email,
          password: null, // No password for Google users
          googleId: uid,
          photoURL,
          authProvider: 'google',
          emailVerified: emailVerified || false
        });

        // Create financial profile
        await FinancialProfile.create({ userId: user.id });

        // Create default subscription (OweSmart tier)
        await Subscription.create({
          userId: user.id,
          tier: 'OweSmart',
          price: 19.90,
          status: 'active',
          startDate: new Date(),
          features: {
            dashboard: true,
            aiRecommendations: true,
            gamification: true,
            consolidation: true,
            creditReporting: false
          }
        });

        // Create gamification profile
        await Gamification.create({
          userId: user.id,
          points: 0,
          level: 1,
          streak: 0,
          achievements: [],
          milestones: {}
        });
      }
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
        authProvider: user.authProvider
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
