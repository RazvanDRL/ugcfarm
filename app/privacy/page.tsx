import React from 'react';

const PrivacyPage: React.FC = () => {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Privacy Policy</h1>
            <p>Last updated: January 17, 2025</p>

            <h2 className="text-xl font-semibold">1. Introduction</h2>
            <p>
                This Privacy Policy explains how UGC.Farm ("we", "us", "our") collects, uses, and protects your data. We value your privacy and strive to be transparent about our data practices.
            </p>

            <h2 className="text-xl font-semibold">2. Information We Collect</h2>
            <h3 className="text-lg font-semibold">2.1 Information You Provide</h3>
            <ul>
                <li>Email address</li>
                <li>Account credentials</li>
                <li>Content generation inputs</li>
                <li>Generated content and preferences</li>
            </ul>

            <h3 className="text-lg font-semibold">2.2 Automatically Collected Information</h3>
            <ul>
                <li>Usage patterns</li>
                <li>Device information</li>
                <li>IP address</li>
                <li>Browser type</li>
                <li>Platform interactions</li>
                <li>Performance metrics</li>
            </ul>

            <h3 className="text-lg font-semibold">2.3 AI Generation Data</h3>
            <ul>
                <li>Input prompts</li>
                <li>Generation parameters</li>
                <li>Avatar preferences</li>
                <li>Content settings</li>
                <li>Output history</li>
            </ul>

            <h2 className="text-xl font-semibold">3. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
                <li>Generate AI content</li>
                <li>Enhance service quality</li>
                <li>Prevent misuse</li>
                <li>Provide support via Intercom</li>
                <li>Analyze performance</li>
                <li>Maintain security</li>
            </ul>

            <h2 className="text-xl font-semibold">4. Third-Party Services</h2>
            <p>We work with trusted partners:</p>
            <ul>
                <li>Stripe: Payment processing</li>
                <li>Intercom: Customer support</li>
                <li>AI providers: Content generation</li>
                <li>Analytics services: Usage statistics</li>
                <li>Cloud providers: Infrastructure</li>
            </ul>
            <p>Each partner follows their own privacy policies and data handling practices.</p>

            <h2 className="text-xl font-semibold">5. Content Storage and Processing</h2>
            <h3 className="text-lg font-semibold">5.1 Generated Content</h3>
            <ul>
                <li>Stored securely in our systems</li>
                <li>Processed for generation</li>
                <li>Retained per usage terms</li>
                <li>Accessible through your account</li>
            </ul>

            <h3 className="text-lg font-semibold">5.2 AI Training</h3>
            <ul>
                <li>We do not use your content to train our AI</li>
                <li>Input data is used only for your content</li>
                <li>Generated content remains private</li>
            </ul>

            <h2 className="text-xl font-semibold">6. Data Security</h2>
            <p>We implement security measures including:</p>
            <ul>
                <li>Encryption in transit and at rest</li>
                <li>Secure authentication</li>
                <li>Regular security updates</li>
                <li>Access controls</li>
                <li>Monitoring systems</li>
            </ul>

            <h2 className="text-xl font-semibold">7. Your Rights</h2>
            <p>Under GDPR and applicable laws, you can:</p>
            <ul>
                <li>Access your data</li>
                <li>Request corrections</li>
                <li>Export your data</li>
                <li>Withdraw consent</li>
                <li>Object to processing</li>
            </ul>

            <h2 className="text-xl font-semibold">8. Data Retention</h2>
            <p>We retain your data:</p>
            <ul>
                <li>While your account is active</li>
                <li>As required by law</li>
                <li>For legitimate business purposes</li>
                <li>Until content credits are used</li>
            </ul>

            <h2 className="text-xl font-semibold">9. Platform Integrations</h2>
            <p>When you use platform integrations:</p>
            <ul>
                <li>We may share necessary data</li>
                <li>Platform terms apply</li>
                <li>You control connections</li>
                <li>You can revoke access</li>
            </ul>

            <h2 className="text-xl font-semibold">10. Analytics and Performance</h2>
            <p>We collect analytics to:</p>
            <ul>
                <li>Improve generation quality</li>
                <li>Optimize performance</li>
                <li>Enhance user experience</li>
                <li>Debug issues</li>
                <li>Monitor system health</li>
            </ul>

            <h2 className="text-xl font-semibold">11. International Data Transfers</h2>
            <p>Your data may be processed in different countries with appropriate safeguards under GDPR.</p>

            <h2 className="text-xl font-semibold">12. Children's Privacy</h2>
            <p>Our Service is not intended for users under 13. We do not knowingly collect data from children.</p>

            <h2 className="text-xl font-semibold">13. Changes to This Policy</h2>
            <p>We may update this policy. Changes will be:</p>
            <ul>
                <li>Posted on our website</li>
                <li>Notified through service</li>
                <li>Effective immediately</li>
            </ul>

            <h2 className="text-xl font-semibold">14. Your Choices</h2>
            <p>You can:</p>
            <ul>
                <li>Manage account settings</li>
                <li>Control integrations</li>
                <li>Opt out of communications</li>
            </ul>

            <h2 className="text-xl font-semibold">15. Contact Us</h2>
            <p>For privacy questions:</p>
            <ul>
                <li>Use Intercom on our website</li>
                <li>Response within 48 hours</li>
            </ul>

            <h2 className="text-xl font-semibold">16. Additional Rights</h2>
            <h3 className="text-lg font-semibold">EU/EEA Users</h3>
            <p>You have the right to lodge complaints with data protection authorities.</p>

            <h3 className="text-lg font-semibold">California Users</h3>
            <p>Additional rights under CCPA/CPRA available upon request.</p>
        </div>
    );
};

export default PrivacyPage;