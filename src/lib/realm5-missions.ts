
import React from 'react';

interface Mission {
  id: number;
  title: string;
  subtitle: string;
  description: React.ReactNode;
  simulationType: 'bip' | 'fork' | 'historicalForks' | 'governance' | 'knowledge' | 'failedForks';
  unlocked: boolean;
  completed: boolean;
}

export const realm5Missions: Mission[] = [
  {
    id: 1,
    title: "The Proposal Path",
    subtitle: "Understanding Bitcoin Improvement Proposals (BIPs)",
    description: React.createElement("div", { className: "space-y-4" },
      React.createElement("img", { 
        src: "https://bitcoiners.africa/wp-content/uploads/2025/06/Realm-5-The-Proposal-Path.png",
        alt: "Everyday Bitcoin Tools",
        className: "w-full h-48 object-cover rounded-lg mb-4"
      }),
      React.createElement("p", null, 
        "Welcome to the heart of Bitcoin's evolution process. In this comprehensive mission, you'll master the Bitcoin Improvement Proposal (BIP) system - the formal process through which Bitcoin's protocol evolves."
      ),
      React.createElement("h3", { className: "text-xl font-semibold mb-2 text-purple-400" }, "BIP Fundamentals"),
      React.createElement("p", null, 
        "A Bitcoin Improvement Proposal (BIP) is a design document providing information to the Bitcoin community, or describing a new feature for Bitcoin or its processes. The BIP process is the primary mechanism for proposing major new features, collecting community input on an issue, and documenting design decisions."
      ),
      React.createElement("div", { className: "bg-purple-900/30 p-4 rounded-xl my-4" },
        React.createElement("h4", { className: "font-semibold mb-2" }, "BIP Categories:"),
        React.createElement("ul", { className: "list-disc pl-5 space-y-2" },
          React.createElement("li", null, "Standards Track BIPs: Changes requiring network consensus"),
          React.createElement("li", null, "Informational BIPs: Design guidelines or information"),
          React.createElement("li", null, "Process BIPs: Changes to Bitcoin processes")
        )
      ),
      React.createElement("h3", { className: "text-xl font-semibold mb-2 text-purple-400" }, "The BIP Lifecycle"),
      React.createElement("div", { className: "space-y-2" },
        React.createElement("p", null, "Every BIP goes through specific stages:"),
        React.createElement("ol", { className: "list-decimal pl-5 space-y-2" },
          React.createElement("li", null, "Draft: Initial proposal documentation"),
          React.createElement("li", null, "Proposed: Formal submission for peer review"),
          React.createElement("li", null, "Final/Active: Accepted and implemented"),
          React.createElement("li", null, "Deferred/Withdrawn/Rejected: Other possible outcomes")
        )
      ),
      React.createElement("div", { className: "bg-purple-900/30 p-4 rounded-xl my-4" },
        React.createElement("h4", { className: "font-semibold mb-2" }, "Key Historical BIPs:"),
        React.createElement("ul", { className: "list-disc pl-5 space-y-2" },
          React.createElement("li", null, "BIP39: Mnemonic code for generating deterministic keys"),
          React.createElement("li", null, "BIP141: Segregated Witness (SegWit)"),
          React.createElement("li", null, "BIP340: Schnorr Signatures"),
          React.createElement("li", null, "BIP341: Taproot: SegWit version 1 spending rules")
        )
      )
    ),
    simulationType: 'bip',
    unlocked: true,
    completed: false
  },
  {
    id: 2,
    title: "Path of the Fork",
    subtitle: "Understanding Protocol Upgrade Mechanisms",
    description: React.createElement("div", { className: "space-y-4" },
      React.createElement("img", { 
        src: "https://bitcoiners.africa/wp-content/uploads/2025/06/Realm-5-Path-of-the-Fork.png",
        alt: "Everyday Bitcoin Tools",
        className: "w-full h-48 object-cover rounded-lg mb-4"
      }),
      React.createElement("p", null, 
        "Explore the critical concept of forks in Bitcoin's evolution. This mission delves deep into how Bitcoin can be upgraded while maintaining decentralization and consensus."
      ),
      React.createElement("h3", { className: "text-xl font-semibold mb-2 text-purple-400" }, "Types of Forks"),
      React.createElement("div", { className: "grid md:grid-cols-2 gap-4 mb-4" },
        React.createElement("div", { className: "bg-purple-900/30 p-4 rounded-xl" },
          React.createElement("h4", { className: "font-semibold mb-2" }, "Soft Forks"),
          React.createElement("p", null, "Backward-compatible protocol upgrades:"),
          React.createElement("ul", { className: "list-disc pl-5 space-y-1" },
            React.createElement("li", null, "Old nodes continue to operate"),
            React.createElement("li", null, "Only miners need to upgrade"),
            React.createElement("li", null, "Gradual adoption possible"),
            React.createElement("li", null, "Example: SegWit, P2SH, CLTV")
          )
        ),
        React.createElement("div", { className: "bg-purple-900/30 p-4 rounded-xl" },
          React.createElement("h4", { className: "font-semibold mb-2" }, "Hard Forks"),
          React.createElement("p", null, "Non-backward-compatible changes:"),
          React.createElement("ul", { className: "list-disc pl-5 space-y-1" },
            React.createElement("li", null, "Creates a permanent chain split"),
            React.createElement("li", null, "All nodes must upgrade"),
            React.createElement("li", null, "Requires complete coordination"),
            React.createElement("li", null, "Example: Bitcoin Cash fork")
          )
        )
      ),
      React.createElement("h3", { className: "text-xl font-semibold mb-2 text-purple-400" }, "Fork Activation Methods"),
      React.createElement("div", { className: "space-y-4" },
        React.createElement("div", { className: "bg-purple-900/30 p-4 rounded-xl" },
          React.createElement("h4", { className: "font-semibold mb-2" }, "Activation Mechanisms:"),
          React.createElement("ul", { className: "list-disc pl-5 space-y-2" },
            React.createElement("li", null, 
              React.createElement("strong", null, "BIP9 (Version Bits):"),
              " Miners signal readiness through block version"
            ),
            React.createElement("li", null, 
              React.createElement("strong", null, "BIP148 (UASF):"),
              " User-activated soft fork - nodes enforce rules"
            ),
            React.createElement("li", null, 
              React.createElement("strong", null, "BIP91:"),
              " Reduced threshold activation mechanism"
            ),
            React.createElement("li", null, 
              React.createElement("strong", null, "Speedy Trial:"),
              " Time-bounded miner signaling period"
            )
          )
        )
      )
    ),
    simulationType: 'fork',
    unlocked: true,
    completed: false
  },
  {
    id: 3,
    title: "Historic Forks: Bitcoin's Evolution",
    subtitle: "Learning from Bitcoin's Major Protocol Changes",
    description: React.createElement("div", { className: "space-y-4" },
      React.createElement("img", { 
        src: "https://bitcoiners.africa/wp-content/uploads/2025/06/Realm-5-History-Forks.png",
        alt: "Everyday Bitcoin Tools",
        className: "w-full h-48 object-cover rounded-lg mb-4"
      }),
      React.createElement("p", null, 
        "Journey through Bitcoin's most significant protocol changes and learn how they shaped the network we know today."
      ),
      React.createElement("div", { className: "space-y-6" },
        React.createElement("div", { className: "bg-purple-900/30 p-4 rounded-xl" },
          React.createElement("h4", { className: "font-semibold mb-2" }, "SegWit (2017)"),
          React.createElement("p", null, "A pivotal soft fork that revolutionized Bitcoin's transaction structure:"),
          React.createElement("ul", { className: "list-disc pl-5 space-y-1" },
            React.createElement("li", null, "Fixed transaction malleability"),
            React.createElement("li", null, "Enabled Lightning Network development"),
            React.createElement("li", null, "Increased block capacity"),
            React.createElement("li", null, "Complex activation through UASF pressure")
          )
        ),
        React.createElement("div", { className: "bg-purple-900/30 p-4 rounded-xl" },
          React.createElement("h4", { className: "font-semibold mb-2" }, "Taproot (2021)"),
          React.createElement("p", null, "A sophisticated upgrade enhancing Bitcoin's smart contract capabilities:"),
          React.createElement("ul", { className: "list-disc pl-5 space-y-1" },
            React.createElement("li", null, "Improved multisig efficiency"),
            React.createElement("li", null, "Enhanced privacy for complex scripts"),
            React.createElement("li", null, "Introduced Schnorr signatures"),
            React.createElement("li", null, "Successful Speedy Trial activation")
          )
        )
      ),
      React.createElement("h3", { className: "text-xl font-semibold mb-2 mt-4 text-purple-400" }, "Technical Deep Dive"),
      React.createElement("div", { className: "bg-purple-900/30 p-4 rounded-xl" },
        React.createElement("h4", { className: "font-semibold mb-2" }, "SegWit Implementation Details:"),
        React.createElement("ul", { className: "list-disc pl-5 space-y-2" },
          React.createElement("li", null, "Witness data segregation"),
          React.createElement("li", null, "New transaction format"),
          React.createElement("li", null, "Backward compatibility mechanism"),
          React.createElement("li", null, "Weight units vs. bytes")
        )
      )
    ),
    simulationType: 'historicalForks',
    unlocked: true,
    completed: false
  },
  {
    id: 4,
    title: "The Governance Council",
    subtitle: "Bitcoin's Decentralized Decision-Making",
    description: React.createElement("div", { className: "space-y-4" },
      React.createElement("img", { 
        src: "https://bitcoiners.africa/wp-content/uploads/2025/06/Realm-5-The-Gouvernance-Council.png",
        alt: "Everyday Bitcoin Tools",
        className: "w-full h-48 object-cover rounded-lg mb-4"
      }),
      React.createElement("p", null, 
        "Master the intricacies of Bitcoin's governance model and understand how decisions are made in a truly decentralized network."
      ),
      React.createElement("div", { className: "grid md:grid-cols-2 gap-4 mb-4" },
        React.createElement("div", { className: "bg-purple-900/30 p-4 rounded-xl" },
          React.createElement("h4", { className: "font-semibold mb-2" }, "Key Stakeholders"),
          React.createElement("ul", { className: "list-disc pl-5 space-y-1" },
            React.createElement("li", null, "Core Developers"),
            React.createElement("li", null, "Miners & Mining Pools"),
            React.createElement("li", null, "Full Node Operators"),
            React.createElement("li", null, "Users & Businesses"),
            React.createElement("li", null, "Hardware Manufacturers")
          )
        ),
        React.createElement("div", { className: "bg-purple-900/30 p-4 rounded-xl" },
          React.createElement("h4", { className: "font-semibold mb-2" }, "Power Distribution"),
          React.createElement("ul", { className: "list-disc pl-5 space-y-1" },
            React.createElement("li", null, "Checks and balances"),
            React.createElement("li", null, "Economic incentives"),
            React.createElement("li", null, "Technical merit"),
            React.createElement("li", null, "Social consensus"),
            React.createElement("li", null, "Market forces")
          )
        )
      ),
      React.createElement("h3", { className: "text-xl font-semibold mb-2 text-purple-400" }, "Governance Mechanisms"),
      React.createElement("div", { className: "space-y-4" },
        React.createElement("div", { className: "bg-purple-900/30 p-4 rounded-xl" },
          React.createElement("h4", { className: "font-semibold mb-2" }, "Decision-Making Processes:"),
          React.createElement("ul", { className: "list-disc pl-5 space-y-2" },
            React.createElement("li", null, "BIP Process & Review"),
            React.createElement("li", null, "GitHub Pull Requests"),
            React.createElement("li", null, "Developer Meetings"),
            React.createElement("li", null, "Mailing List Discussions"),
            React.createElement("li", null, "Conference Presentations")
          )
        )
      )
    ),
    simulationType: 'governance',
    unlocked: true,
    completed: false
  },
  {
    id: 5,
    title: "Governance in Action",
    subtitle: "Practical Decision-Making Scenarios",
    description: React.createElement("div", { className: "space-y-4" },
      React.createElement("img", { 
        src: "https://bitcoiners.africa/wp-content/uploads/2025/06/Realm-5-Gouvernance-in-Action.png",
        alt: "Everyday Bitcoin Tools",
        className: "w-full h-48 object-cover rounded-lg mb-4"
      }),
      React.createElement("p", null,
        "Apply your knowledge through realistic governance scenarios and decision-making challenges."
      ),
      React.createElement("div", { className: "bg-purple-900/30 p-4 rounded-xl mb-4" },
        React.createElement("h4", { className: "font-semibold mb-2" }, "Interactive Scenarios:"),
        React.createElement("ul", { className: "list-disc pl-5 space-y-2" },
          React.createElement("li", null, "Protocol Upgrade Proposals"),
          React.createElement("li", null, "Consensus Building"),
          React.createElement("li", null, "Stakeholder Coordination"),
          React.createElement("li", null, "Emergency Response")
        )
      ),
      React.createElement("h3", { className: "text-xl font-semibold mb-2 text-purple-400" }, "Practical Exercises"),
      React.createElement("div", { className: "space-y-4" },
        React.createElement("div", { className: "bg-purple-900/30 p-4 rounded-xl" },
          React.createElement("h4", { className: "font-semibold mb-2" }, "Hands-on Activities:"),
          React.createElement("ul", { className: "list-disc pl-5 space-y-2" },
            React.createElement("li", null, "Draft a BIP proposal"),
            React.createElement("li", null, "Analyze stakeholder interests"),
            React.createElement("li", null, "Navigate technical debates"),
            React.createElement("li", null, "Build consensus strategies")
          )
        )
      )
    ),
    simulationType: 'knowledge',
    unlocked: true,
    completed: false
  },
  {
    id: 6,
    title: "Learning from Failures",
    subtitle: "Historical Fork Case Studies",
    description: React.createElement("div", { className: "space-y-4" },
      React.createElement("img", { 
        src: "https://bitcoiners.africa/wp-content/uploads/2025/06/Realm-5-Learning-from-failures.png",
        alt: "Everyday Bitcoin Tools",
        className: "w-full h-48 object-cover rounded-lg mb-4"
      }),
      React.createElement("h3", { className: "text-xl font-semibold mb-2 text-purple-400" }, "Failed Fork Analysis"),
      React.createElement("div", { className: "space-y-6" },
        React.createElement("div", { className: "bg-purple-900/30 p-4 rounded-xl" },
          React.createElement("h4", { className: "font-semibold mb-2" }, "SegWit2x (2017)"),
          React.createElement("p", null, "A controversial scaling proposal that ultimately failed:"),
          React.createElement("ul", { className: "list-disc pl-5 space-y-1" },
            React.createElement("li", null, "New York Agreement context"),
            React.createElement("li", null, "Technical challenges"),
            React.createElement("li", null, "Community resistance"),
            React.createElement("li", null, "Lessons in consensus building")
          )
        ),
        React.createElement("div", { className: "bg-purple-900/30 p-4 rounded-xl" },
          React.createElement("h4", { className: "font-semibold mb-2" }, "Bitcoin XT & Bitcoin Classic"),
          React.createElement("p", null, "Early attempts at protocol changes:"),
          React.createElement("ul", { className: "list-disc pl-5 space-y-1" },
            React.createElement("li", null, "Block size increase proposals"),
            React.createElement("li", null, "Development approach issues"),
            React.createElement("li", null, "Community division impact"),
            React.createElement("li", null, "Governance lessons")
          )
        )
      ),
      React.createElement("h3", { className: "text-xl font-semibold mb-2 mt-4 text-purple-400" }, "Key Lessons"),
      React.createElement("div", { className: "bg-purple-900/30 p-4 rounded-xl" },
        React.createElement("ul", { className: "list-disc pl-5 space-y-2" },
          React.createElement("li", null, "Importance of technical consensus"),
          React.createElement("li", null, "Role of social consensus"),
          React.createElement("li", null, "Impact of rushed changes"),
          React.createElement("li", null, "Value of conservative approach")
        )
      )
    ),
    simulationType: 'failedForks',
    unlocked: true,
    completed: false
  }
];
