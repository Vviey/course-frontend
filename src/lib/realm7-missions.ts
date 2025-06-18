import React from 'react';

interface Mission {
  id: number;
  title: string;
  subtitle: string;
  description: React.ReactNode;
  contentType: 'comprehensive' | 'practical' | 'technical' | 'final' | 'certificate';
  simulationType?: string;
  quizData?: {
    questions: Array<{
      question: string;
      options: string[];
      correctAnswer: number;
    }>;
  };
  content: string;
  unlocked: boolean;
  completed: boolean;
}

export const realm7Missions: Mission[] = [
  {
    id: 1,
    title: "Comprehensive Review",
    subtitle: "Your Bitcoin Journey So Far",
    description: React.createElement("div", { className: "space-y-4" },
      React.createElement("p", null, 
        "Your journey through Bitcoin's realms has equipped you with diverse knowledge. Now, solidify your understanding through comprehensive review and practical application."
      ),
      React.createElement("h3", { className: "text-lg font-semibold mt-6 mb-2" }, "You'll Review:"),
      React.createElement("ul", { className: "list-disc pl-5 space-y-1" },
        React.createElement("li", null, "The evolution of money and Bitcoin's role"),
        React.createElement("li", null, "Privacy, security, and financial sovereignty"),
        React.createElement("li", null, "Cryptographic foundations"),
        React.createElement("li", null, "Mining and consensus mechanisms"),
        React.createElement("li", null, "Protocol governance and upgrades"),
        React.createElement("li", null, "Real-world applications in Africa")
      )
    ),
    // simulationType: "comprehensive",
    quizData: {
      questions: [
        {
          question: "What are the three core functions of money?",
          options: [
            "Medium of exchange, store of value, unit of account",
            "Spending, saving, borrowing",
            "Gold, silver, copper",
            "Mining, trading, holding"
          ],
          correctAnswer: 0
        },
        {
          question: "Which cryptographic primitive enables Bitcoin transaction signatures?",
          options: [
            "SHA-256",
            "ECDSA",
            "AES",
            "RSA"
          ],
          correctAnswer: 1
        }
      ]
    },
    content: `
      <div style="width: 100%; padding: 0; margin: 0; min-height: 100vh;">
        <div style="background-color: rgba(34, 211, 238, 0.1); border-radius: 12px; padding: 32px; margin-bottom: 40px;">
          <h2 style="color: #22d3ee; margin-top: 0; text-align: center; font-size: 28px;">Your Complete Bitcoin Journey</h2>
          
          <p style="margin-bottom: 20px; font-size: 16px; line-height: 1.6;">Congratulations on reaching the Summit of Knowledge! This comprehensive review will help consolidate your understanding of Bitcoin's foundational concepts, technical aspects, and real-world implications that you've explored throughout your journey.</p>
          
          <div style="background-color: rgba(0, 0, 0, 0.15); border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
            <p style="font-size: 18px; font-weight: bold; margin: 0; color: #67e8f9;">Bitcoin is a revolutionary technology that combines cryptography, distributed systems, economics, and game theory to create a secure, censorship-resistant monetary network</p>
          </div>
        </div>
        
        <div style="background-color: rgba(34, 211, 238, 0.05); border-radius: 12px; padding: 32px; margin-bottom: 40px;">
          <h2 style="color: #22d3ee; margin-top: 0; font-size: 24px;">Realm 1: The Origins of Money</h2>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
            <div style="background-color: rgba(0, 0, 0, 0.15); border-radius: 8px; padding: 20px; border-left: 4px solid #22d3ee;">
              <h3 style="color: #67e8f9; margin-top: 0; font-size: 18px;">Key Concepts</h3>
              <ul style="margin-bottom: 0; padding-left: 20px; line-height: 1.6;">
                <li>The evolution from barter to commodity and fiat money</li>
                <li>Money's essential functions: medium of exchange, store of value, unit of account</li>
                <li>The properties of sound money: durability, portability, divisibility, fungibility, scarcity</li>
                <li>Historical examples of money from different African cultures</li>
                <li>How hyperinflation destroys value and undermines financial systems</li>
              </ul>
            </div>
            
            <div style="background-color: rgba(0, 0, 0, 0.15); border-radius: 8px; padding: 20px; border-left: 4px solid #22d3ee;">
              <h3 style="color: #67e8f9; margin-top: 0; font-size: 18px;">Bitcoin's Relevance</h3>
              <p style="margin-bottom: 12px;">Bitcoin addresses the historical challenges of money by providing:</p>
              <ul style="margin-bottom: 0; padding-left: 20px; line-height: 1.6;">
                <li>Digital scarcity through a fixed supply of 21 million</li>
                <li>Perfect divisibility down to 1/100,000,000 (one satoshi)</li>
                <li>Borderless transferability without permission</li>
                <li>Resistance to censorship and confiscation</li>
                <li>Protection against arbitrary inflation and debasement</li>
              </ul>
            </div>
          </div>
          
          <div style="background-color: rgba(0, 0, 0, 0.1); border-radius: 8px; padding: 16px; margin-top: 20px;">
            <p style="margin: 0; font-style: italic; text-align: center;">Bitcoin represents the first successful implementation of digital scarcity without requiring trust in a central authority, solving the "double-spending problem" that prevented previous digital money systems from working.</p>
          </div>
        </div>
        
        <div style="background-color: rgba(34, 211, 238, 0.1); border-radius: 12px; padding: 32px; margin-bottom: 40px;">
          <h2 style="color: #22d3ee; margin-top: 0; font-size: 24px;">Realm 2: The Central Citadel</h2>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
            <div style="background-color: rgba(0, 0, 0, 0.15); border-radius: 8px; padding: 20px; border-left: 4px solid #22d3ee;">
              <h3 style="color: #67e8f9; margin-top: 0; font-size: 18px;">Key Concepts</h3>
              <ul style="margin-bottom: 0; padding-left: 20px; line-height: 1.6;">
                <li>Centralized vs. decentralized financial systems</li>
                <li>Privacy concerns in traditional financial infrastructure</li>
                <li>How surveillance capitalism commoditizes personal data</li>
                <li>Central Bank Digital Currencies (CBDCs) and their implications</li>
                <li>The balance between convenience and sovereignty</li>
              </ul>
            </div>
            
            <div style="background-color: rgba(0, 0, 0, 0.15); border-radius: 8px; padding: 20px; border-left: 4px solid #22d3ee;">
              <h3 style="color: #67e8f9; margin-top: 0; font-size: 18px;">Bitcoin's Relevance</h3>
              <p style="margin-bottom: 12px;">Bitcoin offers an alternative to centralized control through:</p>
              <ul style="margin-bottom: 0; padding-left: 20px; line-height: 1.6;">
                <li>Permissionless participation in a global network</li>
                <li>Pseudonymous transactions that increase privacy</li>
                <li>Self-custody options that eliminate counterparty risk</li>
                <li>Resistance to arbitrary rules and restrictions</li>
                <li>Protection against financial censorship and monitoring</li>
              </ul>
            </div>
          </div>
          
          <div style="background-color: rgba(0, 0, 0, 0.1); border-radius: 8px; padding: 16px; margin-top: 20px;">
            <p style="margin: 0; font-style: italic; text-align: center;">The importance of Bitcoin's decentralization cannot be overstated - it creates a financial system where rules are enforced by mathematics and consensus rather than by corruptible institutions.</p>
          </div>
        </div>
        
        <div style="background-color: rgba(34, 211, 238, 0.05); border-radius: 12px; padding: 32px; margin-bottom: 40px;">
          <h2 style="color: #22d3ee; margin-top: 0; font-size: 24px;">Realm 3: The Forest of Sparks</h2>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
            <div style="background-color: rgba(0, 0, 0, 0.15); border-radius: 8px; padding: 20px; border-left: 4px solid #22d3ee;">
              <h3 style="color: #67e8f9; margin-top: 0; font-size: 18px;">Key Concepts</h3>
              <ul style="margin-bottom: 0; padding-left: 20px; line-height: 1.6;">
                <li>Bitcoin's origin with Satoshi Nakamoto's 2008 whitepaper</li>
                <li>The cypherpunk movement and digital privacy advocates</li>
                <li>Previous digital currency attempts (DigiCash, e-gold, etc.)</li>
                <li>Cryptographic primitives: hash functions and digital signatures</li>
                <li>The blockchain as a chronological, immutable ledger</li>
              </ul>
            </div>
            
            <div style="background-color: rgba(0, 0, 0, 0.15); border-radius: 8px; padding: 20px; border-left: 4px solid #22d3ee;">
              <h3 style="color: #67e8f9; margin-top: 0; font-size: 18px;">Technical Foundation</h3>
              <p style="margin-bottom: 12px;">Bitcoin's technical innovation combines:</p>
              <ul style="margin-bottom: 0; padding-left: 20px; line-height: 1.6;">
                <li>SHA-256 hash functions to create unique digital fingerprints</li>
                <li>Public-key cryptography for secure ownership verification</li>
                <li>Digital signatures to prove transaction authorization</li>
                <li>Distributed ledger technology for transparent record-keeping</li>
                <li>Peer-to-peer network architecture for direct value transfer</li>
              </ul>
            </div>
          </div>
          
          <div style="background-color: rgba(0, 0, 0, 0.1); border-radius: 8px; padding: 16px; margin-top: 20px;">
            <p style="margin: 0; font-style: italic; text-align: center;">Bitcoin represents the synthesis of decades of cryptographic research and experimentation - it didn't emerge from nowhere but built upon a foundation of prior work in digital currency and distributed systems.</p>
          </div>
        </div>
        
        <div style="background-color: rgba(34, 211, 238, 0.1); border-radius: 12px; padding: 32px; margin-bottom: 40px;">
          <h2 style="color: #22d3ee; margin-top: 0; font-size: 24px;">Realm 4: The Mountain Forge</h2>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
            <div style="background-color: rgba(0, 0, 0, 0.15); border-radius: 8px; padding: 20px; border-left: 4px solid #22d3ee;">
              <h3 style="color: #67e8f9; margin-top: 0; font-size: 18px;">Key Concepts</h3>
              <ul style="margin-bottom: 0; padding-left: 20px; line-height: 1.6;">
                <li>Mining as the process of transaction validation and block creation</li>
                <li>Proof-of-Work (PoW) as Bitcoin's consensus mechanism</li>
                <li>The halving schedule and controlled supply issuance</li>
                <li>Difficulty adjustment to maintain consistent block times</li>
                <li>Energy consumption and incentive alignment</li>
              </ul>
            </div>
            
            <div style="background-color: rgba(0, 0, 0, 0.15); border-radius: 8px; padding: 20px; border-left: 4px solid #22d3ee;">
              <h3 style="color: #67e8f9; margin-top: 0; font-size: 18px;">Security Model</h3>
              <p style="margin-bottom: 12px;">Bitcoin's security derives from:</p>
              <ul style="margin-bottom: 0; padding-left: 20px; line-height: 1.6;">
                <li>Economic incentives that make honesty more profitable than cheating</li>
                <li>Computational work that makes attacking the network prohibitively expensive</li>
                <li>Decentralized validation by thousands of independent nodes</li>
                <li>The difficulty adjustment mechanism that maintains security regardless of hash rate</li>
                <li>Game theory that aligns miners' profit motives with network security</li>
              </ul>
            </div>
          </div>
          
          <div style="background-color: rgba(0, 0, 0, 0.1); border-radius: 8px; padding: 16px; margin-top: 20px;">
            <p style="margin: 0; font-style: italic; text-align: center;">Mining transforms electricity into security, creating an immutable history that becomes exponentially more difficult to change as time passes - this is Bitcoin's key innovation for establishing trust without authorities.</p>
          </div>
        </div>
        
        <div style="background-color: rgba(34, 211, 238, 0.05); border-radius: 12px; padding: 32px; margin-bottom: 40px;">
          <h2 style="color: #22d3ee; margin-top: 0; font-size: 24px;">Realm 5: The Council of Forks</h2>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
            <div style="background-color: rgba(0, 0, 0, 0.15); border-radius: 8px; padding: 20px; border-left: 4px solid #22d3ee;">
              <h3 style="color: #67e8f9; margin-top: 0; font-size: 18px;">Key Concepts</h3>
              <ul style="margin-bottom: 0; padding-left: 20px; line-height: 1.6;">
                <li>Bitcoin's governance model through distributed consensus</li>
                <li>Soft forks vs. hard forks as mechanism for protocol upgrades</li>
                <li>Bitcoin Improvement Proposals (BIPs) process</li>
                <li>The balance of power between developers, miners, users, and businesses</li>
                <li>Historical upgrades and the conservative approach to changes</li>
              </ul>
            </div>
            
            <div style="background-color: rgba(0, 0, 0, 0.15); border-radius: 8px; padding: 20px; border-left: 4px solid #22d3ee;">
              <h3 style="color: #67e8f9; margin-top: 0; font-size: 18px;">Governance in Practice</h3>
              <p style="margin-bottom: 12px;">Bitcoin's resilience comes from:</p>
              <ul style="margin-bottom: 0; padding-left: 20px; line-height: 1.6;">
                <li>The requirement for broad consensus before implementing changes</li>
                <li>The ability for users to reject unwanted changes by not upgrading</li>
                <li>The focus on backward compatibility to prevent network fragmentation</li>
                <li>Open development processes with multiple independent reviewers</li>
                <li>The principle of "rough consensus" requiring substantial agreement</li>
              </ul>
            </div>
          </div>
          
          <div style="background-color: rgba(0, 0, 0, 0.1); border-radius: 8px; padding: 16px; margin-top: 20px;">
            <p style="margin: 0; font-style: italic; text-align: center;">Bitcoin's governance might seem slow and conservative, but this resistance to change is a feature, not a bug - it ensures that only thoroughly vetted improvements with broad support are implemented.</p>
          </div>
        </div>
        
        <div style="background-color: rgba(34, 211, 238, 0.1); border-radius: 12px; padding: 32px; margin-bottom: 40px;">
          <h2 style="color: #22d3ee; margin-top: 0; font-size: 24px;">Realm 6: The Ubuntu Village</h2>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
            <div style="background-color: rgba(0, 0, 0, 0.15); border-radius: 8px; padding: 20px; border-left: 4px solid #22d3ee;">
              <h3 style="color: #67e8f9; margin-top: 0; font-size: 18px;">Key Concepts</h3>
              <ul style="margin-bottom: 0; padding-left: 20px; line-height: 1.6;">
                <li>Real-world Bitcoin applications across Africa</li>
                <li>Bitcoin's role in facilitating low-cost remittances</li>
                <li>Protection against currency devaluation and inflation</li>
                <li>Financial inclusion for the unbanked and underbanked</li>
                <li>The Lightning Network for fast, low-fee transactions</li>
              </ul>
            </div>
            
            <div style="background-color: rgba(0, 0, 0, 0.15); border-radius: 8px; padding: 20px; border-left: 4px solid #22d3ee;">
              <h3 style="color: #67e8f9; margin-top: 0; font-size: 18px;">Impact in Africa</h3>
              <p style="margin-bottom: 12px;">Bitcoin is making a difference through:</p>
              <ul style="margin-bottom: 0; padding-left: 20px; line-height: 1.6;">
                <li>Enabling cross-border payments without traditional banking infrastructure</li>
                <li>Providing an alternative to unstable local currencies</li>
                <li>Creating entrepreneurial opportunities in Bitcoin services</li>
                <li>Facilitating direct international trade without intermediaries</li>
                <li>Supporting community projects and educational initiatives</li>
              </ul>
            </div>
          </div>
          
          <div style="background-color: rgba(0, 0, 0, 0.1); border-radius: 8px; padding: 16px; margin-top: 20px;">
            <p style="margin: 0; font-style: italic; text-align: center;">The principles of Ubuntu - "I am because we are" - align with Bitcoin's network effects, where the system becomes stronger and more valuable as more people participate in it.</p>
          </div>
        </div>
        
        <div style="background-color: rgba(34, 211, 238, 0.07); border-radius: 12px; padding: 32px;">
          <h2 style="color: #22d3ee; margin-top: 0; text-align: center; font-size: 24px;">Bringing It All Together</h2>
          
          <p style="margin-bottom: 20px; font-size: 16px; line-height: 1.6;">Bitcoin represents a synthesis of multiple disciplines and addresses challenges that have persisted throughout monetary history. Its lasting impact comes from combining:</p>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-top: 20px;">
            <div style="background-color: rgba(0, 0, 0, 0.15); border-radius: 8px; padding: 20px; text-align: center;">
              <div style="font-size: 32px; margin-bottom: 12px;">📜</div>
              <h3 style="color: #67e8f9; margin: 0 0 12px 0;">Historical Context</h3>
              <p style="margin: 0; font-size: 14px; line-height: 1.5;">Bitcoin addresses the shortcomings of previous monetary systems, from commodity money to fiat currencies</p>
            </div>
            
            <div style="background-color: rgba(0, 0, 0, 0.15); border-radius: 8px; padding: 20px; text-align: center;">
              <div style="font-size: 32px; margin-bottom: 12px;">🔐</div>
              <h3 style="color: #67e8f9; margin: 0 0 12px 0;">Technical Innovation</h3>
              <p style="margin: 0; font-size: 14px; line-height: 1.5;">A revolutionary combination of cryptography, distributed systems, and economic incentives</p>
            </div>
            
            <div style="background-color: rgba(0, 0, 0, 0.15); border-radius: 8px; padding: 20px; text-align: center;">
              <div style="font-size: 32px; margin-bottom: 12px;">⚖️</div>
              <h3 style="color: #67e8f9; margin: 0 0 12px 0;">Governance Innovation</h3>
              <p style="margin: 0; font-size: 14px; line-height: 1.5;">A new model for reaching consensus without central authorities or formal governance structures</p>
            </div>
            
            <div style="background-color: rgba(0, 0, 0, 0.15); border-radius: 8px; padding: 20px; text-align: center;">
              <div style="font-size: 32px; margin-bottom: 12px;">🌍</div>
              <h3 style="color: #67e8f9; margin: 0 0 12px 0;">Global Impact</h3>
              <p style="margin: 0; font-size: 14px; line-height: 1.5;">Practical solutions to real-world problems of financial access, sovereignty, and inclusion</p>
            </div>
          </div>
          
          <div style="background-color: rgba(0, 0, 0, 0.1); border-radius: 8px; padding: 16px; margin-top: 20px; text-align: center;">
            <p style="margin: 0; font-style: italic;">Understanding Bitcoin holistically requires appreciating both its technological foundation and its economic, social, and political implications. No single perspective captures its full significance.</p>
          </div>
        </div>
      </div>
    `,
    contentType: 'comprehensive',
    unlocked: true,
    completed: false
  },
  {
    id: 2,
    title: "Practical Challenges",
    subtitle: "Apply Your Knowledge",
    description: React.createElement("div", { className: "space-y-4" },
      React.createElement("p", null, 
        "Put your knowledge into action through real-world scenarios and practical problem-solving."
      )
    ),
    // simulationType: "practical",
    quizData: {
      questions: [
        {
          question: "When setting up a Bitcoin node, which network port should be open?",
          options: [
            "8333",
            "3000",
            "80",
            "443"
          ],
          correctAnswer: 0
        }
      ]
    },
    content: `
      <div style="width: 100%; padding: 0; margin: 0; min-height: 100vh;">
        <div style="background-color: rgba(34, 211, 238, 0.1); border-radius: 12px; padding: 32px; margin-bottom: 40px;">
          <h3 style="color: #22d3ee; font-size: 24px; margin-bottom: 16px;">Challenge 1: Wallet Security Setup</h3>
          <p style="margin-bottom: 16px; font-size: 16px;">Scenario: You're advising a small business in Ghana about accepting Bitcoin payments.</p>

          <div style="background-color: rgba(0, 0, 0, 0.15); border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h4 style="color: #67e8f9; margin-bottom: 12px;">Required Tasks:</h4>
            <ol style="padding-left: 20px; line-height: 1.6;">
              <li>Choose appropriate wallet types for different amounts</li>
              <li>Design backup procedures</li>
              <li>Create security protocols</li>
            </ol>
          </div>

          <div style="background-color: rgba(0, 0, 0, 0.15); border-radius: 8px; padding: 20px;">
            <h4 style="color: #67e8f9; margin-bottom: 12px;">Solution Framework:</h4>
            <ul style="padding-left: 20px; line-height: 1.6;">
              <li>Hot wallet for daily transactions (<$1000)</li>
              <li>Cold storage for larger amounts</li>
              <li>Multisig setup for business funds</li>
            </ul>
          </div>
        </div>

        <div style="background-color: rgba(34, 211, 238, 0.05); border-radius: 12px; padding: 32px;">
          <h3 style="color: #22d3ee; font-size: 24px; margin-bottom: 16px;">Challenge 2: Mining Operation Analysis</h3>
          <p style="margin-bottom: 16px; font-size: 16px;">Scenario: Evaluate the viability of a small mining operation using hydroelectric power in Uganda.</p>

          <div style="background-color: rgba(0, 0, 0, 0.15); border-radius: 8px; padding: 20px;">
            <h4 style="color: #67e8f9; margin-bottom: 12px;">Required Calculations:</h4>
            <ul style="padding-left: 20px; line-height: 1.6;">
              <li>Power costs: $0.04/kWh</li>
              <li>Available power: 1 MW</li>
              <li>Current Bitcoin price: $40,000</li>
              <li>Network hashrate: 400 EH/s</li>
            </ul>
          </div>
        </div>
      </div>
    `,
    contentType: 'practical',
    unlocked: true,
    completed: false
  },
  {
    id: 3,
    title: "Technical Mastery",
    subtitle: "Diving Deeper",
    description: React.createElement("div", { className: "space-y-4" },
      React.createElement("p", null, 
        "Master the technical intricacies of Bitcoin's protocol and network architecture."
      )
    ),
    // simulationType: "technical",
    quizData: {
      questions: [
        {
          question: "What is the maximum size of Bitcoin's witness data in a block?",
          options: [
            "1 MB",
            "2 MB",
            "4 MB",
            "8 MB"
          ],
          correctAnswer: 2
        }
      ]
    },
    content: `
      <div style="width: 100%; padding: 0; margin: 0; min-height: 100vh;">
        <div style="background-color: rgba(34, 211, 238, 0.1); border-radius: 12px; padding: 32px; margin-bottom: 40px;">
          <h3 style="color: #22d3ee; font-size: 24px; margin-bottom: 16px;">Bitcoin Protocol Deep Dive</h3>

          <div style="background-color: rgba(0, 0, 0, 0.15); border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h4 style="color: #67e8f9; margin-bottom: 12px;">Transaction Structure</h4>
            <pre style="background-color: rgba(0, 0, 0, 0.3); padding: 16px; border-radius: 6px; overflow-x: auto; font-size: 14px; color: #fff;">
Transaction {
  version: 2,
  inputs: [Input],
  outputs: [Output],
  locktime: 0
}</pre>
            <p style="margin-top: 12px;">Each transaction must satisfy these conditions:</p>
            <ul style="padding-left: 20px; line-height: 1.6;">
              <li>All inputs must be unspent (UTXO model)</li>
              <li>Total input value ≥ total output value</li>
              <li>All input scripts must evaluate to true</li>
            </ul>
          </div>

          <div style="background-color: rgba(0, 0, 0, 0.15); border-radius: 8px; padding: 20px;">
            <h4 style="color: #67e8f9; margin-bottom: 12px;">Script Language</h4>
            <p style="margin-bottom: 12px;">Bitcoin's script is a stack-based language with operations like:</p>
            <ul style="padding-left: 20px; line-height: 1.6;">
              <li>OP_CHECKSIG: Validates transaction signatures</li>
              <li>OP_HASH160: Performs RIPEMD160(SHA256(x))</li>
              <li>OP_EQUAL: Compares top two stack items</li>
            </ul>
          </div>
        </div>

        <div style="background-color: rgba(34, 211, 238, 0.05); border-radius: 12px; padding: 32px;">
          <h3 style="color: #22d3ee; font-size: 24px; margin-bottom: 16px;">Network Architecture</h3>

          <div style="background-color: rgba(0, 0, 0, 0.15); border-radius: 8px; padding: 20px;">
            <h4 style="color: #67e8f9; margin-bottom: 12px;">Node Types</h4>
            <ul style="padding-left: 20px; line-height: 1.6;">
              <li>Full nodes: Validate all transactions and blocks</li>
              <li>Light nodes: Verify headers only (SPV)</li>
              <li>Mining nodes: Create new blocks</li>
            </ul>
          </div>
        </div>
      </div>
    `,
    contentType: 'technical',
    unlocked: true,
    completed: false
  },

  {
    id: 4,
    title: "The Final Challenge",
    subtitle: "Comprehensive Bitcoin Mastery Test",
    description: React.createElement("div", { className: "space-y-4" },
      React.createElement("p", null, 
        "A 21-question deep dive testing technical and conceptual Bitcoin knowledge"
      ),
      React.createElement("p", null,
        "Prove your understanding before taking the official Bitcoiner Certification"
      )
    ),
    content: `
      <div style="
        width: 100%;
        padding: 0;
        margin: 0;
        min-height: 100vh;
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        color: white;
        font-family: 'Inter', sans-serif;
      ">
        <div style="
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        ">
          <!-- Quiz Header -->
          <div style="
            text-align: center;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid rgba(56, 182, 255, 0.3);
          ">
            <h1 style="
              font-size: 2.5rem;
              font-weight: 700;
              margin-bottom: 0.5rem;
              background: linear-gradient(90deg, #38b6ff 0%, #3ea6ff 100%);
              -webkit-background-clip: text;
              background-clip: text;
              color: transparent;
            ">Bitcoin Mastery Challenge</h1>
            <p style="color: #94a3b8; font-size: 1.1rem;">
              21 questions covering technical and economic concepts
            </p>
          </div>
  
          <!-- Quiz Container -->
          <div id="bitcoin-quiz-container" style="
            background: rgba(15, 23, 42, 0.7);
            border-radius: 12px;
            border: 1px solid rgba(56, 182, 255, 0.2);
            padding: 2rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          ">
            <!-- Progress/Scores will be inserted here by JS -->
            <div id="quiz-progress" style="
              display: flex;
              justify-content: space-between;
              margin-bottom: 1.5rem;
              font-size: 0.9rem;
            ">
              <span id="current-question" style="color: #38b6ff;">Question 1 of 21</span>
              <span id="quiz-score" style="
                background: rgba(56, 182, 255, 0.15);
                color: #38b6ff;
                padding: 0.25rem 0.75rem;
                border-radius: 999px;
              ">Score: 0</span>
            </div>
  
            <!-- Question -->
            <h2 id="quiz-question" style="
              font-size: 1.5rem;
              line-height: 1.4;
              margin-bottom: 2rem;
              color: #f8fafc;
            ">Loading question...</h2>
  
            <!-- Options -->
            <div id="quiz-options" style="display: grid; gap: 0.75rem;">
              <!-- Options will be inserted here by JS -->
            </div>
  
            <!-- Feedback -->
            <div id="quiz-feedback" style="
              margin-top: 1.5rem;
              padding: 1rem;
              border-radius: 8px;
              display: none;
            "></div>
  
            <!-- Results Screen (hidden initially) -->
            <div id="quiz-results" style="
              text-align: center;
              display: none;
              margin-top: 2rem;
            ">
              <h2 style="
                font-size: 2rem;
                margin-bottom: 1rem;
                background: linear-gradient(90deg, #38b6ff 0%, #3ea6ff 100%);
                -webkit-background-clip: text;
                background-clip: text;
                color: transparent;
              ">Quiz Completed!</h2>
              
              <div id="results-emoji" style="font-size: 4rem; margin: 1rem 0;">🎉</div>
              
              <p style="font-size: 1.25rem; margin-bottom: 0.5rem;">
                Your score: <span id="final-score" style="font-weight: 700;">0</span>/21
              </p>
              
              <p id="results-message" style="color: #94a3b8; margin-bottom: 2rem;">
                Loading your results...
              </p>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <button id="retake-btn" style="
                  background: rgba(56, 182, 255, 0.1);
                  color: #38b6ff;
                  border: 1px solid rgba(56, 182, 255, 0.3);
                  padding: 0.75rem;
                  border-radius: 8px;
                  cursor: pointer;
                  transition: all 0.2s;
                ">Retake Quiz</button>
                
                <button id="continue-btn" style="
                  background: linear-gradient(90deg, #38b6ff 0%, #3ea6ff 100%);
                  color: white;
                  border: none;
                  padding: 0.75rem;
                  border-radius: 8px;
                  cursor: pointer;
                  transition: all 0.2s;
                  font-weight: 600;
                ">Continue Learning</button>
              </div>
            </div>
          </div>
  
          <!-- Vibrant CTA -->
          <div id="bitcoiner-cta" style="
            margin-top: 3rem;
            background: linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%);
            border-radius: 12px;
            padding: 2rem;
            text-align: center;
            box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);
            animation: pulse 2s infinite;
            display: none;
          ">
            <h3 style="
              font-size: 1.5rem;
              font-weight: 700;
              color: white;
              margin-bottom: 0.5rem;
            ">Ready for the Ultimate Test?</h3>
            <p style="color: rgba(255, 255, 255, 0.9); margin-bottom: 1.5rem;">
              Validate your Bitcoin knowledge with the official Bitcoiner Certification
            </p>
            <a href="https://bitcoinertest.com/" target="_blank" style="
              display: inline-block;
              background: white;
              color: #8b5cf6;
              font-weight: 600;
              padding: 0.75rem 2rem;
              border-radius: 999px;
              text-decoration: none;
              transition: transform 0.2s;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            ">Take the Bitcoiner Test →</a>
            <p style="color: rgba(255, 255, 255, 0.7); margin-top: 1rem; font-size: 0.9rem;">
              Become a verified Bitcoiner today
            </p>
          </div>
        </div>
  
        <style>
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.02); }
            100% { transform: scale(1); }
          }
  
          .quiz-option {
            background: rgba(30, 41, 59, 0.7);
            border: 1px solid rgba(56, 182, 255, 0.2);
            color: #e2e8f0;
            padding: 1rem 1.25rem;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
            text-align: left;
          }
  
          .quiz-option:hover {
            background: rgba(56, 182, 255, 0.1);
            border-color: rgba(56, 182, 255, 0.4);
          }
  
          .quiz-option.correct {
            background: rgba(22, 163, 74, 0.2);
            border-color: rgba(74, 222, 128, 0.5);
          }
  
          .quiz-option.incorrect {
            background: rgba(220, 38, 38, 0.2);
            border-color: rgba(248, 113, 113, 0.5);
          }
  
          #retake-btn:hover {
            background: rgba(56, 182, 255, 0.2);
          }
  
          #continue-btn:hover {
            opacity: 0.9;
            transform: translateY(-2px);
          }
        </style>
  
        <script>
          // Quiz data
          const questions = [
            {
              question: "What are the three core functions of money according to economic theory?",
              options: [
                "Medium of exchange, store of value, unit of account",
                "Spending, saving, borrowing",
                "Gold, silver, copper standards",
                "Mining, trading, holding assets"
              ],
              correct: 0,
              explanation: "These three functions are universally recognized by economists as the essential characteristics of money."
            },
            {
              question: "Which cryptographic primitive enables Bitcoin transaction signatures?",
              options: [
                "SHA-256 (Secure Hash Algorithm)",
                "ECDSA (Elliptic Curve Digital Signature Algorithm)",
                "AES (Advanced Encryption Standard)",
                "RSA (Rivest-Shamir-Adleman)"
              ],
              correct: 1,
              explanation: "Bitcoin uses ECDSA with the secp256k1 curve for creating digital signatures that prove ownership."
            },
            // ... (include all 21 questions from previous example)
            {
              question: "Which of these is NOT a recommended security practice for Bitcoin storage?",
              options: [
                "Multi-signature wallets",
                "Paper wallets in a safe",
                "Sharing private keys with friends",
                "Using a passphrase with hardware wallets"
              ],
              correct: 2,
              explanation: "Private keys should NEVER be shared - this gives others complete control over your bitcoin."
            }
          ];
  
          // Quiz state
          let currentQuestionIndex = 0;
          let score = 0;
          let selectedAnswers = Array(questions.length).fill(null);
  
          // DOM elements
          const quizContainer = document.getElementById('bitcoin-quiz-container');
          const progressElement = document.getElementById('current-question');
          const scoreElement = document.getElementById('quiz-score');
          const questionElement = document.getElementById('quiz-question');
          const optionsContainer = document.getElementById('quiz-options');
          const feedbackElement = document.getElementById('quiz-feedback');
          const resultsElement = document.getElementById('quiz-results');
          const finalScoreElement = document.getElementById('final-score');
          const resultsMessageElement = document.getElementById('results-message');
          const resultsEmojiElement = document.getElementById('results-emoji');
          const ctaElement = document.getElementById('bitcoiner-cta');
  
          // Initialize quiz
          function loadQuestion() {
            const question = questions[currentQuestionIndex];
            questionElement.textContent = question.question;
            progressElement.textContent = \`Question \${currentQuestionIndex + 1} of \${questions.length}\`;
            
            optionsContainer.innerHTML = '';
            question.options.forEach((option, index) => {
              const optionElement = document.createElement('button');
              optionElement.className = 'quiz-option';
              optionElement.innerHTML = \`\${String.fromCharCode(97 + index)}) \${option}\`;
              optionElement.addEventListener('click', () => selectAnswer(index));
              optionsContainer.appendChild(optionElement);
            });
          }
  
          // Handle answer selection
          function selectAnswer(answerIndex) {
            const question = questions[currentQuestionIndex];
            selectedAnswers[currentQuestionIndex] = answerIndex;
            
            // Disable all options
            const options = document.querySelectorAll('.quiz-option');
            options.forEach(opt => opt.style.pointerEvents = 'none');
            
            // Mark correct/incorrect
            if (answerIndex === question.correct) {
              score++;
              scoreElement.textContent = \`Score: \${score}\`;
              options[answerIndex].classList.add('correct');
              feedbackElement.innerHTML = \`
                <div style="color: #4ade80; font-weight: 500;">✓ Correct!</div>
                <div style="color: #94a3b8; margin-top: 0.5rem;">\${question.explanation}</div>
              \`;
            } else {
              options[answerIndex].classList.add('incorrect');
              options[question.correct].classList.add('correct');
              feedbackElement.innerHTML = \`
                <div style="color: #f87171; font-weight: 500;">✗ Incorrect</div>
                <div style="color: #94a3b8; margin-top: 0.5rem;">\${question.explanation}</div>
              \`;
            }
            
            feedbackElement.style.display = 'block';
            
            // Move to next question or show results
            setTimeout(() => {
              if (currentQuestionIndex < questions.length - 1) {
                currentQuestionIndex++;
                loadQuestion();
                feedbackElement.style.display = 'none';
              } else {
                showResults();
              }
            }, 1500);
          }
  
          // Show final results
          function showResults() {
            quizContainer.style.display = 'none';
            resultsElement.style.display = 'block';
            ctaElement.style.display = 'block';
            
            finalScoreElement.textContent = score;
            
            const percentage = (score / questions.length) * 100;
            if (percentage >= 80) {
              resultsEmojiElement.textContent = '🎉';
              resultsMessageElement.textContent = 'Bitcoin Master! You clearly understand the fundamentals.';
            } else if (percentage >= 50) {
              resultsEmojiElement.textContent = '👍';
              resultsMessageElement.textContent = 'Solid knowledge! Keep learning to deepen your understanding.';
            } else {
              resultsEmojiElement.textContent = '🧐';
              resultsMessageElement.textContent = 'Getting started! Review the material and try again.';
            }
          }
  
          // Event listeners for buttons
          document.getElementById('retake-btn').addEventListener('click', () => {
            currentQuestionIndex = 0;
            score = 0;
            selectedAnswers = Array(questions.length).fill(null);
            scoreElement.textContent = 'Score: 0';
            quizContainer.style.display = 'block';
            resultsElement.style.display = 'none';
            feedbackElement.style.display = 'none';
            loadQuestion();
          });
  
          document.getElementById('continue-btn').addEventListener('click', () => {
            // Replace with your actual continue logic
            window.location.href = '/';
          });
  
          // Start the quiz
          loadQuestion();
        </script>
      </div>
    `,
    contentType: 'final',
    unlocked: true,
    completed: false
  },

  
    {
    id: 5,
    title: "Journey's End",
    subtitle: "Your Bitcoin Certification",
    description: React.createElement("div", { className: "space-y-4" },
      React.createElement("p", null, 
        "Receive your certification and reflect on your Bitcoin journey."
      )
    ),
    // simulationType: "certificate",
    content: `
      <div style="width: 100%; padding: 0; margin: 0; min-height: 100vh;">
        <div style="background-color: rgba(34, 211, 238, 0.1); border-radius: 12px; padding: 32px; margin-bottom: 40px;">
          <h3 style="color: #22d3ee; font-size: 24px; margin-bottom: 16px;">Your Bitcoin Journey Achievement</h3>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div style="background-color: rgba(0, 0, 0, 0.15); border-radius: 8px; padding: 20px;">
              <h4 style="color: #67e8f9; margin-bottom: 12px;">Knowledge Mastery</h4>
              <ul style="padding-left: 20px; line-height: 1.6;">
                <li>Monetary history and principles</li>
                <li>Technical protocol understanding</li>
                <li>Security and privacy concepts</li>
              </ul>
            </div>

            <div style="background-color: rgba(0, 0, 0, 0.15); border-radius: 8px; padding: 20px;">
              <h4 style="color: #67e8f9; margin-bottom: 12px;">Practical Skills</h4>
              <ul style="padding-left: 20px; line-height: 1.6;">
                <li>Wallet management</li>
                <li>Network participation</li>
                <li>Community education</li>
              </ul>
            </div>
          </div>
        </div>

        <div style="background-color: rgba(34, 211, 238, 0.05); border-radius: 12px; padding: 32px;">
          <h3 style="color: #22d3ee; font-size: 24px; margin-bottom: 16px;">Certification Details</h3>
          <p style="margin-bottom: 12px;">This certification validates your comprehensive understanding of:</p>
          <ul style="padding-left: 20px; line-height: 1.6;">
            <li>Bitcoin's technical architecture</li>
            <li>Economic principles and implications</li>
            <li>Real-world applications and impact</li>
            <li>Security best practices</li>
            <li>Future development potential</li>
          </ul>
        </div>
      </div>
    `,
    contentType: 'certificate',
    unlocked: true,
    completed: false
  }
];