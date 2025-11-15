const User = require("../../models/user");
const UserAddress = require("../../models/user_address");
const PartnerInformation = require("../../models/partner_information");
const NotificationSetting = require("../../models/notification_setting");
const MatchingPreference = require("../../models/matching_preference");
const TwoFactorDevice = require("../../models/two_factor_device");
const bcrypt = require("bcryptjs");

/**
 * Get complete user settings
 */
const getSettings = async (req, res) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(401).json({ message: "Unauthorized access." });
    }

    // Fetch all settings data
    const [
      user,
      address,
      partner,
      notifications,
      matchingPrefs,
      twoFactorDevices,
    ] = await Promise.all([
      User.findByPk(user_id, {
        attributes: {
          exclude: ["password", "reset_password_token", "two_factor_secret"],
        },
      }),
      UserAddress.findOne({
        where: { user_id, is_active: true, is_primary: true },
      }),
      PartnerInformation.findOne({ where: { user_id, is_active: true } }),
      NotificationSetting.findAll({ where: { user_id, is_active: true } }),
      MatchingPreference.findOne({ where: { user_id, is_active: true } }),
      TwoFactorDevice.findAll({ where: { user_id, is_active: true } }),
    ]);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({
      message: "Settings retrieved successfully.",
      settings: {
        basic_information: {
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          phone_number: user.phone_number,
          profile_picture_url: user.profile_picture_url,
        },
        home_address: address || null,
        partner_information: partner || null,
        notification_settings: notifications || [],
        matching_preferences: matchingPrefs || null,
        security: {
          two_factor_enabled: user.two_factor_enabled,
          devices: twoFactorDevices || [],
        },
      },
    });
  } catch (error) {
    console.error("Get settings error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * Update basic information
 */
const updateBasicInfo = async (req, res) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(401).json({ message: "Unauthorized access." });
    }

    const { first_name, last_name, phone_number, profile_picture_url } =
      req.body;

    const updateData = {
      updated_by: user_id,
      updated_at: new Date(),
    };

    if (first_name !== undefined) updateData.first_name = first_name;
    if (last_name !== undefined) updateData.last_name = last_name;
    if (phone_number !== undefined) updateData.phone_number = phone_number;
    if (profile_picture_url !== undefined)
      updateData.profile_picture_url = profile_picture_url;

    await User.update(updateData, { where: { id: user_id } });

    const updatedUser = await User.findByPk(user_id, {
      attributes: {
        exclude: ["password", "reset_password_token", "two_factor_secret"],
      },
    });

    return res.status(200).json({
      message: "Basic information updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update basic info error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * Update or create home address
 */
const updateHomeAddress = async (req, res) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(401).json({ message: "Unauthorized access." });
    }

    const { address_line_1, address_line_2, city, state, zip_code, country } =
      req.body;

    const existingAddress = await UserAddress.findOne({
      where: { user_id, is_active: true, is_primary: true },
    });

    const addressData = {
      address_line_1,
      address_line_2,
      city,
      state,
      zip_code,
      country,
      updated_by: user_id,
      updated_at: new Date(),
    };

    let address;
    if (existingAddress) {
      await existingAddress.update(addressData);
      address = existingAddress;
    } else {
      address = await UserAddress.create({
        user_id,
        ...addressData,
        address_type: "home",
        is_primary: true,
        created_by: user_id,
        created_at: new Date(),
      });
    }

    return res.status(200).json({
      message: "Home address updated successfully.",
      address,
    });
  } catch (error) {
    console.error("Update home address error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * Update or create partner information
 */
const updatePartnerInfo = async (req, res) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(401).json({ message: "Unauthorized access." });
    }

    const { first_name, last_name, phone_number, email, profile_picture_url } =
      req.body;

    const existingPartner = await PartnerInformation.findOne({
      where: { user_id, is_active: true },
    });

    const partnerData = {
      first_name,
      last_name,
      phone_number,
      email,
      profile_picture_url,
      updated_by: user_id,
      updated_at: new Date(),
    };

    let partner;
    if (existingPartner) {
      await existingPartner.update(partnerData);
      partner = existingPartner;
    } else {
      partner = await PartnerInformation.create({
        user_id,
        ...partnerData,
        created_by: user_id,
        created_at: new Date(),
      });
    }

    return res.status(200).json({
      message: "Partner information updated successfully.",
      partner,
    });
  } catch (error) {
    console.error("Update partner info error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * Update password
 */
const updatePassword = async (req, res) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(401).json({ message: "Unauthorized access." });
    }

    const { current_password, new_password, confirm_password } = req.body;

    if (!current_password || !new_password || !confirm_password) {
      return res.status(400).json({
        message:
          "current_password, new_password, and confirm_password are required.",
      });
    }

    if (new_password !== confirm_password) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    if (new_password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long.",
      });
    }

    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(current_password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Current password is incorrect." });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(new_password, salt);

    await user.update({
      password: hashedPassword,
      updated_by: user_id,
      updated_at: new Date(),
    });

    return res.status(200).json({
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.error("Update password error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * Update notification settings
 */
const updateNotificationSettings = async (req, res) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(401).json({ message: "Unauthorized access." });
    }

    const { settings } = req.body;

    if (!settings || !Array.isArray(settings)) {
      return res.status(400).json({
        message: "settings array is required.",
      });
    }

    const results = [];

    for (const setting of settings) {
      const { notification_type, toast_enabled, email_enabled, sms_enabled } =
        setting;

      if (!notification_type) {
        continue;
      }

      const existingSetting = await NotificationSetting.findOne({
        where: { user_id, notification_type, is_active: true },
      });

      const settingData = {
        toast_enabled: toast_enabled !== undefined ? toast_enabled : true,
        email_enabled: email_enabled !== undefined ? email_enabled : true,
        sms_enabled: sms_enabled !== undefined ? sms_enabled : false,
        updated_by: user_id,
        updated_at: new Date(),
      };

      if (existingSetting) {
        await existingSetting.update(settingData);
        results.push(existingSetting);
      } else {
        const newSetting = await NotificationSetting.create({
          user_id,
          notification_type,
          ...settingData,
          created_by: user_id,
          created_at: new Date(),
        });
        results.push(newSetting);
      }
    }

    return res.status(200).json({
      message: "Notification settings updated successfully.",
      settings: results,
    });
  } catch (error) {
    console.error("Update notification settings error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * Update matching preferences
 */
const updateMatchingPreferences = async (req, res) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(401).json({ message: "Unauthorized access." });
    }

    const { use_intended_parents_picture, use_partner_picture } = req.body;

    const existingPref = await MatchingPreference.findOne({
      where: { user_id, is_active: true },
    });

    const prefData = {
      use_intended_parents_picture:
        use_intended_parents_picture !== undefined
          ? use_intended_parents_picture
          : true,
      use_partner_picture:
        use_partner_picture !== undefined ? use_partner_picture : false,
      updated_by: user_id,
      updated_at: new Date(),
    };

    let preference;
    if (existingPref) {
      await existingPref.update(prefData);
      preference = existingPref;
    } else {
      preference = await MatchingPreference.create({
        user_id,
        ...prefData,
        created_by: user_id,
        created_at: new Date(),
      });
    }

    return res.status(200).json({
      message: "Matching preferences updated successfully.",
      preference,
    });
  } catch (error) {
    console.error("Update matching preferences error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * Enable/disable two-factor authentication
 */
const updateTwoFactor = async (req, res) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(401).json({ message: "Unauthorized access." });
    }

    const { enabled } = req.body;

    if (enabled === undefined) {
      return res.status(400).json({ message: "enabled field is required." });
    }

    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    await user.update({
      two_factor_enabled: enabled,
      updated_by: user_id,
      updated_at: new Date(),
    });

    return res.status(200).json({
      message: `Two-factor authentication ${
        enabled ? "enabled" : "disabled"
      } successfully.`,
      two_factor_enabled: enabled,
    });
  } catch (error) {
    console.error("Update 2FA error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * Add 2FA device
 */
const addTwoFactorDevice = async (req, res) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(401).json({ message: "Unauthorized access." });
    }

    const { device_name, device_type } = req.body;

    if (!device_name) {
      return res.status(400).json({ message: "device_name is required." });
    }

    const device = await TwoFactorDevice.create({
      user_id,
      device_name,
      device_type,
      created_by: user_id,
      created_at: new Date(),
    });

    return res.status(201).json({
      message: "Device added successfully.",
      device,
    });
  } catch (error) {
    console.error("Add 2FA device error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * Remove 2FA device
 */
const removeTwoFactorDevice = async (req, res) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(401).json({ message: "Unauthorized access." });
    }

    const { id } = req.params;

    const [updated] = await TwoFactorDevice.update(
      {
        is_active: false,
        updated_by: user_id,
        updated_at: new Date(),
      },
      {
        where: { id, user_id, is_active: true },
      }
    );

    if (!updated) {
      return res.status(404).json({ message: "Device not found." });
    }

    return res.status(200).json({
      message: "Device removed successfully.",
    });
  } catch (error) {
    console.error("Remove 2FA device error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  getSettings,
  updateBasicInfo,
  updateHomeAddress,
  updatePartnerInfo,
  updatePassword,
  updateNotificationSettings,
  updateMatchingPreferences,
  updateTwoFactor,
  addTwoFactorDevice,
  removeTwoFactorDevice,
};
