import { Model } from 'sequelize';
import bcrypt from 'bcrypt';
const PROTECTED_ATTRIBUTES = ['password'];

export default (sequelize, DataTypes) => {
  class Users extends Model {
    async validPassword(password) {
      return await bcrypt.compare(password, this.password);
    }

    toJSON() {
      // hide protected fields
      const attributes = { ...this.get() };
      // eslint-disable-next-line no-restricted-syntax
      for (const a of PROTECTED_ATTRIBUTES) {
        delete attributes[a];
      }
      return attributes;
    }
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Users.hasMany(models.Products, {
        foreignKey: 'seller_id',
        as: 'products'
      });
      Users.hasMany(models.Products, {
        foreignKey: 'current_winner_id',
        as: 'current_wins'
      });
      Users.hasMany(models.Bid, {
        foreignKey: 'bidder_id',
        as: 'bids'
      });
      Users.hasMany(models.Watchlist, {
        foreignKey: 'user_id',
        as: 'watchlist'
      });
      Users.hasMany(models.BannedBidders, {
        foreignKey: 'user_id',
        as: 'banned_bidders'
      });
      Users.hasMany(models.Feedbacks, {
        foreignKey: 'reviewer_id',
        as: 'reviews'
      });
      Users.hasMany(models.Feedbacks, {
        foreignKey: 'target_user_id',
        as: 'target_user_reviews'
      });
      Users.hasMany(models.Orders, {
        foreignKey: 'winner_id',
        as: 'won_orders'
      });
      Users.hasMany(models.Orders, {
        foreignKey: 'seller_id',
        as: 'sold_orders'
      });
      Users.hasMany(models.ProductQuestions, {
        foreignKey: 'user_id',
        as: 'questions'
      });
    }
  };
  Users.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Please enter your email address',
      },
      unique: {
        args: true,
        msg: 'Email already exists',
      },
      validate: {
        isEmail: {
          args: true,
          msg: 'Please enter a valid email address',
        },
      },
    },
    password: DataTypes.STRING,
    status: {
      type: DataTypes.STRING,
      defaultValue: 'active',
      validate: {
        isIn: [['active', 'unactive']]
      }
    },
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    phone: {
      type: DataTypes.STRING,
      unique: true,
    },
    role: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        isIn: [[0, 1, 2]] // 0: bidder, 1: seller, 2: admin
      }
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    otp_code: DataTypes.STRING,
    opt_expiry: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    sequelize,
    modelName: 'Users',
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  });
  return Users;
};