import React from 'react';

const TermsPage: React.FC = () => {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Terms of Service</h1>
            <p className="mt-2">Last updated: January 17, 2025</p>

            <h2 className="text-xl font-semibold mt-4">1. Agreement to Terms</h2>
            <p>By accessing or using UGC.Farm ("the Service"), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you do not have permission to access the Service.</p>

            <h2 className="text-xl font-semibold mt-4">2. Service Description</h2>
            <ul className="list-disc ml-5">
                <li>AI-generated video content</li>
                <li>Viral hooks and scripts</li>
                <li>Content scheduling tools</li>
                <li>AI avatar generation</li>
                <li>Analytics features</li>
            </ul>

            <h2 className="text-xl font-semibold mt-4">3. Content Generation and Rights</h2>
            <h3 className="font-semibold mt-2">3.1 AI-Generated Content</h3>
            <ul className="list-disc ml-5">
                <li>Content is generated using AI technology</li>
                <li>Results may vary and are not guaranteed</li>
                <li>Generated content requires human review</li>
                <li>Final content quality depends on input parameters</li>
            </ul>

            <h3 className="font-semibold mt-2">3.2 Content Rights</h3>
            <ul className="list-disc ml-5">
                <li>You own the rights to content generated through our Service</li>
                <li>You grant UGC.Farm license to process and store your content</li>
                <li>You are responsible for ensuring generated content complies with platform guidelines</li>
                <li>You maintain rights to your original inputs and prompts</li>
            </ul>

            <h2 className="text-xl font-semibold mt-4">4. Platform Compliance</h2>
            <h3 className="font-semibold mt-2">4.1 Supported Platforms</h3>
            <ul className="list-disc ml-5">
                <li>TikTok</li>
                <li>Instagram</li>
                <li>YouTube</li>
                <li>RedNote</li>
                <li>Lemon8</li>
            </ul>

            <h3 className="font-semibold mt-2">4.2 Platform Guidelines</h3>
            <ul className="list-disc ml-5">
                <li>Follow each platform's community guidelines</li>
                <li>Respect content restrictions</li>
                <li>Maintain appropriate disclosures</li>
                <li>Comply with advertising policies</li>
            </ul>

            <h2 className="text-xl font-semibold mt-4">5. Usage Limitations</h2>
            <h3 className="font-semibold mt-2">5.1 Plan Restrictions</h3>
            <ul className="list-disc ml-5">
                <li>Starter Plan: 10 videos</li>
                <li>Creator Plan: 50 videos</li>
                <li>Agency Plan: 150 videos</li>
            </ul>

            <h3 className="font-semibold mt-2">5.2 Fair Usage</h3>
            <ul className="list-disc ml-5">
                <li>One account per user/business</li>
                <li>No reverse engineering of AI systems</li>
            </ul>

            <h2 className="text-xl font-semibold mt-4">6. AI Avatars</h2>
            <h3 className="font-semibold mt-2">6.1 Avatar Usage Rights</h3>
            <ul className="list-disc ml-5">
                <li>Avatars are for use within the Service only</li>
                <li>No ownership rights are transferred</li>
                <li>Cannot be used outside of generated content</li>
                <li>Must comply with ethical AI guidelines</li>
            </ul>

            <h3 className="font-semibold mt-2">6.2 Avatar Restrictions</h3>
            <p>You may not use/create avatars that:</p>
            <ul className="list-disc ml-5">
                <li>Impersonate real individuals</li>
                <li>Infringe on publicity rights</li>
                <li>Promote harmful content</li>
                <li>Violate platform guidelines</li>
            </ul>

            <h2 className="text-xl font-semibold mt-4">7. Payment Terms</h2>
            <ul className="list-disc ml-5">
                <li>All plans are one-time purchases and can be re-purchased at any time</li>
                <li>Prices are in USD</li>
                <li>No refunds</li>
                <li>Payments processed via secure providers (currently Stripe)</li>
            </ul>

            <h2 className="text-xl font-semibold mt-4">8. Prohibited Content</h2>
            <p>Users may not generate content that:</p>
            <ul className="list-disc ml-5">
                <li>Is illegal or promotes illegal activities</li>
                <li>Infringes on intellectual property rights</li>
                <li>Contains hate speech or discrimination</li>
                <li>Promotes violence or harassment</li>
                <li>Violates platform guidelines</li>
                <li>Contains adult or explicit material</li>
            </ul>

            <h2 className="text-xl font-semibold mt-4">9. Service Modifications</h2>
            <p>UGC.Farm reserves the right to:</p>
            <ul className="list-disc ml-5">
                <li>Modify or discontinue features</li>
                <li>Update pricing</li>
                <li>Change video limits</li>
                <li>Modify these terms</li>
                <li>Limit service availability</li>
            </ul>

            <h2 className="text-xl font-semibold mt-4">10. Account Termination</h2>
            <p>We may suspend or terminate accounts that:</p>
            <ul className="list-disc ml-5">
                <li>Violate these terms</li>
                <li>Generate prohibited content</li>
                <li>Abuse the service</li>
                <li>Share or resell accounts</li>
                <li>Violate platform guidelines</li>
            </ul>

            <h2 className="text-xl font-semibold mt-4">11. Limitation of Liability</h2>
            <p>UGC.Farm is provided "as is" without warranties. We are not liable for:</p>
            <ul className="list-disc ml-5">
                <li>Content performance</li>
                <li>Platform acceptance</li>
                <li>Account restrictions</li>
                <li>Revenue loss</li>
                <li>Indirect damages</li>
            </ul>

            <h2 className="text-xl font-semibold mt-4">12. Intellectual Property</h2>
            <ul className="list-disc ml-5">
                <li>UGC.Farm retains rights to the platform</li>
                <li>AI models and systems are proprietary</li>
                <li>Generated content rights transfer to users</li>
                <li>Avatar system remains our property</li>
            </ul>

            <h2 className="text-xl font-semibold mt-4">13. Disclaimers</h2>
            <p>We do not guarantee:</p>
            <ul className="list-disc ml-5">
                <li>Content virality or performance</li>
                <li>Platform approval</li>
                <li>Revenue generation</li>
                <li>Specific results</li>
                <li>Continuous service availability</li>
            </ul>

            <h2 className="text-xl font-semibold mt-4">14. Changes to Terms</h2>
            <p>We may update these terms at any time. Continued use of UGC.Farm constitutes acceptance of new terms.</p>

            <h2 className="text-xl font-semibold mt-4">15. Governing Law</h2>
            <p>These terms are governed by Romanian law, without regard to conflict of law principles.</p>

            <h2 className="text-xl font-semibold mt-4">16. Contact</h2>
            <p>For questions about these terms: use the Intercom on our website</p>
        </div>
    );
};

export default TermsPage;