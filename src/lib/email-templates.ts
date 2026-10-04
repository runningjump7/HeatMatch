export interface EmailTemplate {
  subject: string;
  text: string;
  html: string;
}

export function verificationCodeEmail(code: string, fullName: string, businessName: string): EmailTemplate {
  return {
    subject: `Your HeatMatch Verification Code: ${code}`,
    text: `Hi ${fullName},

Thank you for claiming ${businessName} on HeatMatch!

Your 6-digit verification code is:

    ${code}

This code expires in 10 minutes. If you didn't request this, please ignore this email.

Have questions? Reply to this email or visit heatmatch.co.nz/support

—
HeatMatch Team`,
    html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
<h2 style="color: #1f2937;">Your Verification Code</h2>
<p>Hi ${fullName},</p>
<p>Thank you for claiming <strong>${businessName}</strong> on HeatMatch!</p>

<p>Your 6-digit verification code is:</p>

<div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 4px; margin: 20px 0; border-radius: 4px; font-family: monospace;">
  ${code}
</div>

<p><strong>This code expires in 10 minutes.</strong></p>
<p>If you didn't request this, please ignore this email.</p>

<p>Questions? <a href="mailto:support@heatmatch.co.nz" style="color: #10b981;">Contact us</a></p>

<hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
<p style="color: #666; font-size: 12px;">HeatMatch Team</p>
</div>`,
  };
}

export function claimSubmittedEmail(fullName: string, businessName: string, email: string): EmailTemplate {
  const dateTime = new Date().toLocaleDateString('en-NZ', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return {
    subject: `Your ${businessName} Claim Under Review`,
    text: `Hi ${fullName},

Thank you for claiming ${businessName} on HeatMatch!

Your claim has been received and is now under admin review. We'll verify your claim and contact you within 24 hours with the outcome.

Claim Details:
  Business: ${businessName}
  Submitted: ${dateTime}
  Status: Pending Review

We'll email you at ${email} with the result.

Questions? Reply to this email or visit heatmatch.co.nz/support

—
HeatMatch Team`,
    html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
<h2 style="color: #1f2937;">Claim Under Review</h2>
<p>Hi ${fullName},</p>
<p>Thank you for claiming <strong>${businessName}</strong> on HeatMatch!</p>

<p>Your claim has been received and is now under admin review. We'll verify your claim and contact you within 24 hours with the outcome.</p>

<div style="background: #f9fafb; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0;">
  <p><strong>Claim Details:</strong></p>
  <p style="margin: 5px 0;">Business: <strong>${businessName}</strong></p>
  <p style="margin: 5px 0;">Submitted: ${dateTime}</p>
  <p style="margin: 5px 0;">Status: <strong>Pending Review</strong></p>
</div>

<p>We'll email you at <strong>${email}</strong> with the result.</p>

<p>Questions? <a href="mailto:support@heatmatch.co.nz" style="color: #10b981;">Contact us</a></p>

<hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
<p style="color: #666; font-size: 12px;">HeatMatch Team</p>
</div>`,
  };
}

export function welcomeEmail(fullName: string, businessName: string): EmailTemplate {
  return {
    subject: `Welcome to HeatMatch, ${businessName}!`,
    text: `Hi ${fullName},

Welcome to HeatMatch! Your account for ${businessName} is now active and verified.

You're All Set!
  ✓ Email verified
  ✓ Account created
  ✓ Business verified

Next Steps:
  1. Log in to your dashboard
  2. Complete your business profile
  3. Add high-quality photos
  4. Set your service areas
  5. Start receiving leads!

Your Dashboard: heatmatch.co.nz/installer-dashboard

Quick Links:
  - Profile Settings: heatmatch.co.nz/settings
  - Lead Management: heatmatch.co.nz/leads
  - Support: heatmatch.co.nz/support

Questions? We're here to help. Reply to this email anytime.

—
HeatMatch Team`,
    html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
<h2 style="color: #10b981;">Welcome to HeatMatch! 🎉</h2>
<p>Hi ${fullName},</p>
<p>Your account for <strong>${businessName}</strong> is now active and verified.</p>

<div style="background: #f0fdf4; padding: 15px; border-left: 4px solid #10b981; margin: 20px 0;">
  <p><strong>You're All Set!</strong></p>
  <p style="margin: 5px 0;">✓ Email verified</p>
  <p style="margin: 5px 0;">✓ Account created</p>
  <p style="margin: 5px 0;">✓ Business verified</p>
</div>

<h3 style="color: #1f2937;">Next Steps:</h3>
<ol>
  <li>Log in to your dashboard</li>
  <li>Complete your business profile</li>
  <li>Add high-quality photos</li>
  <li>Set your service areas</li>
  <li>Start receiving leads!</li>
</ol>

<p style="margin-top: 20px;">
  <a href="https://heatmatch.co.nz/installer-dashboard" style="background: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">
    Go to Dashboard
  </a>
</p>

<hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
<p style="color: #666; font-size: 12px;">Questions? <a href="mailto:support@heatmatch.co.nz" style="color: #10b981;">Contact us</a></p>
<p style="color: #666; font-size: 12px;">HeatMatch Team</p>
</div>`,
  };
}

export function claimApprovedEmail(fullName: string, businessName: string, email: string, tempPassword: string): EmailTemplate {
  return {
    subject: `Great News! Your ${businessName} Claim is Approved ✓`,
    text: `Hi ${fullName},

Congratulations! Your claim for ${businessName} has been approved.

Your account is now verified and active. Use the temporary password below to log in and access your dashboard:

    Email: ${email}
    Temporary Password: ${tempPassword}

We recommend changing this password after your first login.

Set Up Your Account:
  1. Visit: heatmatch.co.nz/installer-login
  2. Email: ${email}
  3. Password: ${tempPassword}
  4. Change password in settings after login

Your Next Steps:
  - Complete your profile
  - Add photos and service details
  - Start receiving leads!

Questions? Reply to this email or visit heatmatch.co.nz/support

—
HeatMatch Team`,
    html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
<h2 style="color: #10b981;">Congratulations! ✓</h2>
<p>Hi ${fullName},</p>
<p>Your claim for <strong>${businessName}</strong> has been approved!</p>

<p>Your account is now verified and active.</p>

<h3 style="color: #1f2937;">Your Temporary Password</h3>
<div style="background: #f0fdf4; padding: 15px; border-left: 4px solid #10b981; margin: 15px 0;">
  <p><strong>Email:</strong> ${email}</p>
  <p><strong>Password:</strong> <code style="background: #fff; padding: 3px 6px; border-radius: 3px; font-family: monospace;">${tempPassword}</code></p>
</div>

<p style="margin-top: 20px;">
  <a href="https://heatmatch.co.nz/installer-login" style="background: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">
    Log In Now
  </a>
</p>

<p style="margin-top: 20px; padding: 10px; background: #fef3c7; border-radius: 4px; font-size: 12px;">
  <strong>Note:</strong> We recommend changing your password after your first login for security.
</p>

<hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
<p style="color: #666; font-size: 12px;">Questions? <a href="mailto:support@heatmatch.co.nz" style="color: #10b981;">Contact us</a></p>
<p style="color: #666; font-size: 12px;">HeatMatch Team</p>
</div>`,
  };
}

export function claimRejectedEmail(fullName: string, businessName: string, rejectionReason?: string): EmailTemplate {
  const reason = rejectionReason || 'The business details could not be verified.';

  return {
    subject: `Update on Your ${businessName} Claim`,
    text: `Hi ${fullName},

Thank you for your interest in claiming ${businessName} on HeatMatch.

Unfortunately, we were unable to verify your claim at this time. The reason given:

    ${reason}

What You Can Do:
  - If you believe this is an error, please reply to this email
  - Provide additional documentation to support your claim
  - Contact our support team: support@heatmatch.co.nz
  - Try claiming again with a verified business email address

We're here to help! Feel free to reach out with any questions.

—
HeatMatch Team`,
    html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
<h2 style="color: #1f2937;">Update on Your Claim</h2>
<p>Hi ${fullName},</p>
<p>Thank you for your interest in claiming <strong>${businessName}</strong> on HeatMatch.</p>

<p>Unfortunately, we were unable to verify your claim at this time.</p>

<div style="background: #fef2f2; padding: 15px; border-left: 4px solid #ef4444; margin: 20px 0;">
  <p><strong>Reason:</strong></p>
  <p>${reason}</p>
</div>

<h3 style="color: #1f2937;">What You Can Do:</h3>
<ul>
  <li>If you believe this is an error, please <a href="mailto:support@heatmatch.co.nz" style="color: #10b981;">reply to this email</a></li>
  <li>Provide additional documentation to support your claim</li>
  <li>Contact our support team: <a href="mailto:support@heatmatch.co.nz" style="color: #10b981;">support@heatmatch.co.nz</a></li>
  <li>Try claiming again with a verified business email address</li>
</ul>

<p>We're here to help! Feel free to reach out with any questions.</p>

<hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
<p style="color: #666; font-size: 12px;">HeatMatch Team</p>
</div>`,
  };
}
