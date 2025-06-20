// Data for Realm 2 missions

import { Bitcoin } from "lucide-react";

export interface Realm2MissionData {
  completed: any;
  id: number;
  title: string;
  subtitle: string;
  description: string;
  simulationType: 'surveillance' | 'privacy' | 'cbdc' | 'BitcoinFreedomExplorer'|'bitcoin' | 'lightning' | 'selfcustody';
  simulationData?: any;
  content: string;
}

export const realm2Missions: Realm2MissionData[] = [
  {
    id: 101,
    title: "The Central Citadel",
    subtitle: "Introduction to Centralized Monetary Systems",
    description: "Learn about centralized control, surveillance, privacy, and digital currencies in modern financial systems.",
    simulationType: 'surveillance',
    content: `
      <div style="position: relative; background-color: rgba(255, 204, 0, 0.05); border-radius: 12px; padding: 20px; margin-bottom: 24px; overflow: hidden;">
        <div style="position: absolute; top: 0; right: 0; width: 150px; height: 150px; background: radial-gradient(circle at top right, rgba(255, 204, 0, 0.2), transparent 70%); z-index: 0;"></div>

        <img src="https://bitcoiners.africa/wp-content/uploads/2025/06/Realm-2-The-Citadel-Shados.png" 
        alt="Everyday Bitcoin Tools" 
        style="position: relative; z-index: 1; width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 16px;">
        
        <h2 style="color: #FFA500; position: relative; z-index: 1; text-align: center; margin-bottom: 16px;">Welcome to the Central Citadel</h2>
        <h3 style="color: #FFCC00; position: relative; z-index: 1; text-align: center; font-style: italic; margin-bottom: 24px;">Where money listens, watches, and obeys</h3>
        
        <p style="position: relative; z-index: 1; margin-bottom: 20px; text-align: center; font-size: 16px;">
          Imagine living in a city where every time you spend money — buying food, paying for school, helping a friend — someone is watching. Every coin leaves a trail. Every transaction is recorded.
        </p>
        
        <p style="position: relative; z-index: 1; margin-bottom: 0px; text-align: center; font-weight: bold; font-size: 16px;">
          That city is real. It's the world we live in today.
        </p>
      </div>
      
      <div style="background-color: rgba(255, 204, 0, 0.1); border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <h2 style="color: #FFA500; margin-top: 0;">What Is a Centralized Monetary System?</h2>
        
        <p>A <strong>centralized monetary system</strong> is a money system controlled by a small group — usually the government and central banks.</p>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-top: 16px;">
          <div style="background-color: rgba(0, 0, 0, 0.2); border-radius: 8px; padding: 16px; display: flex; flex-direction: column;">
            <div style="font-size: 28px; margin-bottom: 8px; text-align: center;">💰</div>
            <p style="margin: 0; text-align: center;">How much money exists</p>
          </div>
          
          <div style="background-color: rgba(0, 0, 0, 0.2); border-radius: 8px; padding: 16px; display: flex; flex-direction: column;">
            <div style="font-size: 28px; margin-bottom: 8px; text-align: center;">🔑</div>
            <p style="margin: 0; text-align: center;">Who gets access to it</p>
          </div>
          
          <div style="background-color: rgba(0, 0, 0, 0.2); border-radius: 8px; padding: 16px; display: flex; flex-direction: column;">
            <div style="font-size: 28px; margin-bottom: 8px; text-align: center;">📏</div>
            <p style="margin: 0; text-align: center;">What rules must be followed</p>
          </div>
          
          <div style="background-color: rgba(0, 0, 0, 0.2); border-radius: 8px; padding: 16px; display: flex; flex-direction: column;">
            <div style="font-size: 28px; margin-bottom: 8px; text-align: center;">✅</div>
            <p style="margin: 0; text-align: center;">What transactions are allowed</p>
          </div>
        </div>
        
        <p style="margin-top: 20px; font-style: italic; text-align: center; padding: 10px; background-color: rgba(0, 0, 0, 0.1); border-radius: 6px;">
          You don't own your money. You're just allowed to use it — if you follow the rules.
        </p>
      </div>
      
      <div style="background-color: rgba(255, 204, 0, 0.1); border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <h2 style="color: #FFA500; margin-top: 0;">Surveillance and Control: How It Works</h2>
        
        <p>When you use a <strong>bank account</strong>, <strong>mobile money app</strong>, or even <strong>debit card</strong>, here's what's recorded:</p>
        
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin: 16px 0;">
          <div style="background-color: rgba(0, 0, 0, 0.15); border-radius: 6px; padding: 12px; display: flex; align-items: center;">
            <div style="font-size: 20px; margin-right: 12px;">👤</div>
            <div>Who you are (name, ID, phone)</div>
          </div>
          
          <div style="background-color: rgba(0, 0, 0, 0.15); border-radius: 6px; padding: 12px; display: flex; align-items: center;">
            <div style="font-size: 20px; margin-right: 12px;">🛒</div>
            <div>What you're buying</div>
          </div>
          
          <div style="background-color: rgba(0, 0, 0, 0.15); border-radius: 6px; padding: 12px; display: flex; align-items: center;">
            <div style="font-size: 20px; margin-right: 12px;">📍</div>
            <div>Where you're spending</div>
          </div>
          
          <div style="background-color: rgba(0, 0, 0, 0.15); border-radius: 6px; padding: 12px; display: flex; align-items: center;">
            <div style="font-size: 20px; margin-right: 12px;">🕒</div>
            <div>When and how often you use money</div>
          </div>
        </div>
        
        <p>This data is stored — and can be shared with governments, companies, or law enforcement. Sometimes without your permission.</p>
        
        <div style="background-color: rgba(255, 100, 100, 0.1); border-radius: 6px; padding: 12px; margin-top: 16px;">
          <p style="margin: 0; font-weight: bold; color: #FF6B6B;">Financial Censorship</p>
          <p style="margin: 8px 0 0 0;">If someone in power doesn't like what you're doing, they can block your account or reverse a transaction.</p>
        </div>
      </div>
      
      <div style="background-color: rgba(255, 204, 0, 0.1); border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <h2 style="color: #FFA500; margin-top: 0;">Privacy vs. Control: You Choose</h2>
        
        <div style="margin: 20px 0; overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; min-width: 600px;">
            <thead>
              <tr>
                <th style="padding: 12px; text-align: left; border-bottom: 1px solid rgba(255, 204, 0, 0.3); color: #FFCC00;">Feature</th>
                <th style="padding: 12px; text-align: left; border-bottom: 1px solid rgba(255, 204, 0, 0.3); color: #FFCC00;">Central Bank (CBDCs)</th>
                <th style="padding: 12px; text-align: left; border-bottom: 1px solid rgba(255, 204, 0, 0.3); color: #FFCC00;">Bitcoin</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid rgba(255, 204, 0, 0.1);">Who controls it?</td>
                <td style="padding: 12px; border-bottom: 1px solid rgba(255, 204, 0, 0.1);">Government</td>
                <td style="padding: 12px; border-bottom: 1px solid rgba(255, 204, 0, 0.1);">The public (decentralized)</td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid rgba(255, 204, 0, 0.1);">Can your money be frozen?</td>
                <td style="padding: 12px; border-bottom: 1px solid rgba(255, 204, 0, 0.1);">Yes</td>
                <td style="padding: 12px; border-bottom: 1px solid rgba(255, 204, 0, 0.1);">Very hard (you hold the keys)</td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid rgba(255, 204, 0, 0.1);">Is it permissionless?</td>
                <td style="padding: 12px; border-bottom: 1px solid rgba(255, 204, 0, 0.1);">No</td>
                <td style="padding: 12px; border-bottom: 1px solid rgba(255, 204, 0, 0.1);">Yes</td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid rgba(255, 204, 0, 0.1);">Is it private?</td>
                <td style="padding: 12px; border-bottom: 1px solid rgba(255, 204, 0, 0.1);">No</td>
                <td style="padding: 12px; border-bottom: 1px solid rgba(255, 204, 0, 0.1);">Partial (depends on how you use it)</td>
              </tr>
              <tr>
                <td style="padding: 12px;">Is it transparent?</td>
                <td style="padding: 12px;">Not to you</td>
                <td style="padding: 12px;">Yes, for everyone</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div style="display: flex; justify-content: space-around; margin-top: 24px;">
          <div style="text-align: center; max-width: 200px;">
            <div style="font-size: 32px; margin-bottom: 8px;">🏦</div>
            <div style="font-weight: bold; margin-bottom: 4px; color: #FFCC00;">CBDCs</div>
            <div style="font-size: 14px;">Digital money with full control from above</div>
          </div>
          
          <div style="text-align: center; max-width: 200px;">
            <div style="font-size: 32px; margin-bottom: 8px;">⚡</div>
            <div style="font-weight: bold; margin-bottom: 4px; color: #FFCC00;">Bitcoin</div>
            <div style="font-size: 14px;">Digital money that gives you freedom</div>
          </div>
        </div>
      </div>
      
      <div style="background-color: rgba(255, 204, 0, 0.07); border-radius: 8px; padding: 20px; text-align: center;">
        <h2 style="color: #FFA500; margin-top: 0;">Final Thoughts: What World Do You Want?</h2>
        
        <div style="margin: 24px 0; padding: 16px; background-color: rgba(255, 204, 0, 0.1); border-radius: 6px; font-style: italic;">
          "In a world of digital money, privacy is not a luxury. It's survival."
        </div>
        
        <p style="margin-bottom: 16px;">Ask yourself:</p>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px; margin-top: 20px;">
          <div style="background-color: rgba(0, 0, 0, 0.1); border-radius: 6px; padding: 12px; text-align: left;">
            <p style="margin: 0;">Should your money be controlled or free?</p>
          </div>
          
          <div style="background-color: rgba(0, 0, 0, 0.1); border-radius: 6px; padding: 12px; text-align: left;">
            <p style="margin: 0;">Should someone else decide what you can do with it?</p>
          </div>
          
          <div style="background-color: rgba(0, 0, 0, 0.1); border-radius: 6px; padding: 12px; text-align: left;">
            <p style="margin: 0;">Or should you be in charge of your own financial life?</p>
          </div>
        </div>
      </div>
    `,
    completed: undefined
  },
  {
    id: 102,
    title: "Financial Surveillance: The Digital Lens",
    subtitle: "Introduction to financial surveillance and privacy concerns",
    description: "Learn the fundamentals of financial surveillance, its real-world applications, and why privacy matters.",
    simulationType: 'surveillance',
    content: `
      <div style="background-color: rgba(255, 204, 0, 0.1); border: 1px solid rgba(255, 204, 0, 0.3); border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <img src="https://bitcoiners.africa/wp-content/uploads/2025/06/Realm-2-The-Citadel-Shados.png" 
        alt="Everyday Bitcoin Tools" 
        style="position: relative; z-index: 1; width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 16px;">
        <h2 style="color: #FFA500; margin-top: 0;">What is Financial Surveillance?</h2>

        <p>The monitoring and tracking of financial transactions and activities by governments, corporations, or other entities.</p>
        
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 16px;">
          <div style="background-color: rgba(0, 0, 0, 0.2); border-radius: 6px; padding: 12px;">
            <h4 style="color: #FFCC00; margin-top: 0;">What They Track</h4>
            <ul>
              <li>Senders & recipients</li>
              <li>Account balances</li>
              <li>Purchase history</li>
              <li>Transaction times & locations</li>
            </ul>
          </div>
          <div style="background-color: rgba(0, 0, 0, 0.2); border-radius: 6px; padding: 12px;">
            <h4 style="color: #FFCC00; margin-top: 0;">Who Does The Tracking</h4>
            <ul>
              <li>Government agencies</li>
              <li>Financial institutions</li>
              <li>Payment processors</li>
              <li>Tech platforms</li>
            </ul>
          </div>
        </div>
      </div>

      <div style="background-color: rgba(255, 204, 0, 0.1); border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <h2 style="color: #FFA500; margin-top: 0;">Case Study: M-Pesa in Kenya</h2>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
          <div style="flex: 1;">
            <h3 style="color: #FFCC00;">Mobile Money Revolution</h3>
            <p>Launched in 2007, M-Pesa allows Kenyans to deposit, withdraw, transfer money, pay bills, and access loans via mobile phones.</p>
          </div>
          <div style="background-color: rgba(255, 255, 255, 0.1); border-radius: 100%; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; font-size: 24px;">
            📱
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div style="background-color: rgba(0, 180, 0, 0.1); border-radius: 6px; padding: 12px;">
            <h4 style="color: #4CAF50; margin-top: 0;">Benefits</h4>
            <ul>
              <li>Financial inclusion</li>
              <li>Reduced cash crime</li>
              <li>Economic growth</li>
              <li>Easy remittances</li>
            </ul>
          </div>
          <div style="background-color: rgba(180, 0, 0, 0.1); border-radius: 6px; padding: 12px;">
            <h4 style="color: #F44336; margin-top: 0;">Privacy Concerns</h4>
            <ul>
              <li>All transactions logged</li>
              <li>Reveals personal habits</li>
              <li>Government access</li>
              <li>Potential restrictions</li>
            </ul>
          </div>
        </div>
      </div>

      <div style="background-color: rgba(255, 204, 0, 0.1); border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <h2 style="color: #FFA500; margin-top: 0;">Why Financial Privacy Matters</h2>
        
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 16px;">
          <div style="text-align: center; background-color: rgba(0, 0, 0, 0.2); border-radius: 6px; padding: 12px;">
            <div style="font-size: 24px; margin-bottom: 8px;">🛡️</div>
            <h4 style="color: #FFCC00; margin: 0 0 8px 0;">Personal Autonomy</h4>
            <p style="font-size: 12px; margin: 0;">Make economic choices without judgment</p>
          </div>
          <div style="text-align: center; background-color: rgba(0, 0, 0, 0.2); border-radius: 6px; padding: 12px;">
            <div style="font-size: 24px; margin-bottom: 8px;">⚖️</div>
            <h4 style="color: #FFCC00; margin: 0 0 8px 0;">Anti-Discrimination</h4>
            <p style="font-size: 12px; margin: 0;">Prevent unfair treatment</p>
          </div>
          <div style="text-align: center; background-color: rgba(0, 0, 0, 0.2); border-radius: 6px; padding: 12px;">
            <div style="font-size: 24px; margin-bottom: 8px;">🔒</div>
            <h4 style="color: #FFCC00; margin: 0 0 8px 0;">Safety</h4>
            <p style="font-size: 12px; margin: 0;">Protection from targeting</p>
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
          <div style="text-align: center; background-color: rgba(0, 0, 0, 0.2); border-radius: 6px; padding: 12px;">
            <div style="font-size: 24px; margin-bottom: 8px;">💼</div>
            <h4 style="color: #FFCC00; margin: 0 0 8px 0;">Business Confidentiality</h4>
            <p style="font-size: 12px; margin: 0;">Protect sensitive operations</p>
          </div>
          <div style="text-align: center; background-color: rgba(0, 0, 0, 0.2); border-radius: 6px; padding: 12px;">
            <div style="font-size: 24px; margin-bottom: 8px;">🛑</div>
            <h4 style="color: #FFCC00; margin: 0 0 8px 0;">Avoid Manipulation</h4>
            <p style="font-size: 12px; margin: 0;">Prevent exploitation</p>
          </div>
        </div>
      </div>

      <div style="background-color: rgba(255, 204, 0, 0.1); border-radius: 8px; padding: 16px;">
        <h2 style="color: #FFA500; margin-top: 0;">The Privacy Paradox</h2>
        
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <div style="flex: 1; padding-right: 16px;">
            <p>Digital payment systems create unprecedented financial inclusion while simultaneously establishing comprehensive surveillance infrastructure.</p>
          </div>
          <div style="background-color: rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 12px; text-align: center; min-width: 100px;">
            <div style="font-size: 24px;">⚖️</div>
            <div style="font-size: 12px; margin-top: 8px;">Convenience vs. Privacy</div>
          </div>
        </div>
        
        <p style="font-style: italic; text-align: center; border-top: 1px solid rgba(255, 204, 0, 0.3); padding-top: 16px;">
          "This tension - between convenience and privacy, between access and autonomy - forms the central challenge of our modern monetary systems."
        </p>
      </div>
    `,
    completed: undefined
  },
  {
    id: 103,
    title: "The Citadel's Shadows",
    subtitle: "Understanding financial surveillance",
    description: "Learn how centralized monetary systems enable surveillance and financial control.",
    simulationType: 'surveillance',
    content: `
      <div style="position: relative; background-color: rgba(255, 204, 0, 0.05); border-radius: 12px; padding: 20px; margin-bottom: 24px; overflow: hidden;">
        <div style="position: absolute; top: 0; right: 0; width: 150px; height: 150px; background: radial-gradient(circle at top right, rgba(255, 204, 0, 0.2), transparent 70%); z-index: 0;"></div>

        <img src="https://bitcoiners.africa/wp-content/uploads/2025/06/Realm-2-The-Citadel-Shados.png" 
        alt="Everyday Bitcoin Tools" 
        style="position: relative; z-index: 1; width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 16px;">
        
        <h2 style="color: #FFA500; position: relative; z-index: 1;">Financial Control System</h2>
        
        <div style="display: flex; flex-wrap: wrap; gap: 16px; margin-top: 16px; position: relative; z-index: 1;">
          <div style="flex: 1; min-width: 200px; background-color: rgba(0, 0, 0, 0.2); border-radius: 8px; padding: 16px;">
            <h3 style="color: #FFCC00; margin-top: 0;">Surveillance Methods</h3>
            <ul style="padding-left: 20px;">
              <li>Public financial status displays</li>
              <li>Complete transaction history tracking</li>
              <li>Merchant access to customer data</li>
              <li>Location tracking for all purchases</li>
            </ul>
          </div>
          
          <div style="flex: 1; min-width: 200px; background-color: rgba(0, 0, 0, 0.2); border-radius: 8px; padding: 16px;">
            <h3 style="color: #FFCC00; margin-top: 0;">Control Mechanisms</h3>
            <ul style="padding-left: 20px;">
              <li>"Citizen score" based on spending</li>
              <li>Permission required for large purchases</li>
              <li>Access to services tied to financial behavior</li>
              <li>Economic participation restrictions</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div style="background-color: rgba(255, 204, 0, 0.1); border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <h2 style="color: #FFA500; margin-top: 0;">The Privacy Challenge</h2>
        
        <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 20px;">
          <div style="flex: 1;">
            <p>Some citizens find creative ways to conduct transactions outside the watchful eyes of surveillance systems.</p>
          </div>
          <div style="min-width: 80px; height: 80px; background-color: rgba(0, 0, 0, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px;">
            👁️
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px;">
          <div style="background-color: rgba(0, 0, 0, 0.15); border-radius: 6px; padding: 12px; border-left: 3px solid #FFCC00;">
            <h4 style="color: #FFCC00; margin-top: 0; font-size: 14px;">Social Control</h4>
            <p style="font-size: 12px; margin-bottom: 0;">Financial data used to influence behavior</p>
          </div>
          
          <div style="background-color: rgba(0, 0, 0, 0.15); border-radius: 6px; padding: 12px; border-left: 3px solid #FFCC00;">
            <h4 style="color: #FFCC00; margin-top: 0; font-size: 14px;">Privacy Rights</h4>
            <p style="font-size: 12px; margin-bottom: 0;">Financial privacy as a fundamental right</p>
          </div>
          
          <div style="background-color: rgba(0, 0, 0, 0.15); border-radius: 6px; padding: 12px; border-left: 3px solid #FFCC00;">
            <h4 style="color: #FFCC00; margin-top: 0; font-size: 14px;">System Tracking</h4>
            <p style="font-size: 12px; margin-bottom: 0;">How financial systems monitor activity</p>
          </div>
          
          <div style="background-color: rgba(0, 0, 0, 0.15); border-radius: 6px; padding: 12px; border-left: 3px solid #FFCC00;">
            <h4 style="color: #FFCC00; margin-top: 0; font-size: 14px;">Balance</h4>
            <p style="font-size: 12px; margin-bottom: 0;">Transparency vs. privacy tradeoffs</p>
          </div>
        </div>
      </div>
      
      <div style="background-color: rgba(255, 204, 0, 0.07); border-radius: 8px; padding: 16px; text-align: center;">
        <h3 style="color: #FFA500;">Digital Money Privacy Challenge</h3>
        <p>As money becomes increasingly digital, the question of who can see your transactions becomes critically important.</p>
        
        <div style="display: flex; justify-content: center; gap: 30px; margin-top: 16px;">
          <div style="text-align: center;">
            <div style="width: 60px; height: 60px; background-color: rgba(255, 204, 0, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; margin: 0 auto 8px;">
              💰
            </div>
            <div style="font-size: 12px;">Cash = Privacy</div>
          </div>
          
          <div style="text-align: center;">
            <div style="width: 60px; height: 60px; background-color: rgba(255, 204, 0, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; margin: 0 auto 8px;">
              💳
            </div>
            <div style="font-size: 12px;">Digital = Tracking</div>
          </div>
          
          <div style="text-align: center;">
            <div style="width: 60px; height: 60px; background-color: rgba(255, 204, 0, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; margin: 0 auto 8px;">
              ❓
            </div>
            <div style="font-size: 12px;">Future = ?</div>
          </div>
        </div>
      </div>
    `,
    completed: undefined
  },
  {
    id: 104,
    title: "Privacy vs Control",
    subtitle: "Balancing transparency and personal privacy",
    description: "Explore the balance between financial transparency and personal privacy.",
    simulationType: 'privacy',
    content: `
      <div style="background-color: rgba(255, 204, 0, 0.1); border-radius: 8px; padding: 20px; margin-bottom: 24px;">
      <img src="https://bitcoiners.africa/wp-content/uploads/2025/06/Realm-2-The-Citadel-Shados.png" 
        alt="Everyday Bitcoin Tools" 
        style="position: relative; z-index: 1; width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 16px;">
        <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 16px;">
          <div style="flex-grow: 1;">
            <h2 style="color: #FFA500; margin-top: 0;">Understanding Financial Privacy</h2>
            <p>Financial privacy is your ability to conduct economic transactions without unwanted third-party surveillance.</p>
          </div>
          <div style="min-width: 70px; height: 70px; background-color: rgba(0, 0, 0, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px;">
            🔒
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div style="background-color: rgba(0, 0, 0, 0.2); border-radius: 8px; padding: 16px;">
            <h3 style="color: #FFCC00; margin-top: 0;">Traditional Cash Privacy</h3>
            <p style="margin-bottom: 12px;">In physical cash transactions, only the buyer and seller know the details.</p>
            <ul style="padding-left: 20px; margin-bottom: 0;">
              <li>What was purchased</li>
              <li>For how much</li>
              <li>By whom</li>
              <li>When and where</li>
            </ul>
          </div>
          
          <div style="background-color: rgba(0, 0, 0, 0.2); border-radius: 8px; padding: 16px;">
            <h3 style="color: #FFCC00; margin-top: 0;">Digital Transaction Records</h3>
            <p style="margin-bottom: 12px;">Electronic payments create permanent records accessible to:</p>
            <ul style="padding-left: 20px; margin-bottom: 0;">
              <li>Banks & payment processors</li>
              <li>Governments</li>
              <li>Marketing companies</li>
              <li>Data brokers & hackers</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div style="position: relative; background-color: rgba(255, 204, 0, 0.05); border-radius: 12px; padding: 20px; margin-bottom: 24px; overflow: hidden;">
        <h2 style="color: #FFA500; margin-top: 0;">Africa's Digital Transition</h2>
        
        <div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center; margin-bottom: 16px;">
          <div style="flex-grow: 1; min-width: 250px;">
            <p>In Rwanda, the push toward cashless payments through mobile money and cards means nearly all economic activity is now potentially trackable.</p>
          </div>
          <div style="background-color: rgba(0, 0, 0, 0.15); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; align-items: center; min-width: 120px;">
            <div style="font-size: 36px; margin-bottom: 8px;">📱 → 👁️</div>
            <div style="font-size: 13px; text-align: center;">Mobile payments create digital trails</div>
          </div>
        </div>
        
        <p>Traditional African marketplaces operated with cash privacy, but digital systems create unprecedented financial surveillance capability.</p>
      </div>
      
      <div style="background-color: rgba(255, 204, 0, 0.1); border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <h2 style="color: #FFA500; margin-top: 0; text-align: center;">The Balancing Act</h2>
        
        <div style="display: flex; justify-content: center; margin: 16px 0;">
          <div style="width: 60%; height: 8px; background-color: rgba(0, 0, 0, 0.2); border-radius: 4px; position: relative;">
            <div style="position: absolute; left: 0; top: -30px; text-align: center; width: 33.3%;">
              <div style="font-size: 20px;">🔍</div>
              <div style="font-size: 12px;">Complete Transparency</div>
            </div>
            <div style="position: absolute; left: 33.3%; top: -30px; text-align: center; width: 33.3%;">
              <div style="font-size: 20px;">⚖️</div>
              <div style="font-size: 12px;">Reasonable Privacy</div>
            </div>
            <div style="position: absolute; right: 0; top: -30px; text-align: center; width: 33.3%;">
              <div style="font-size: 20px;">🕵️</div>
              <div style="font-size: 12px;">Absolute Privacy</div>
            </div>
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-top: 30px;">
          <div style="background-color: rgba(255, 100, 100, 0.15); border-radius: 6px; padding: 12px;">
            <h4 style="color: #FF6B6B; margin-top: 0; font-size: 14px; text-align: center;">Complete Transparency</h4>
            <ul style="padding-left: 20px; font-size: 12px;">
              <li>All transactions public</li>
              <li>All financial details visible</li>
              <li>No financial secrets</li>
            </ul>
          </div>
          
          <div style="background-color: rgba(100, 200, 100, 0.15); border-radius: 6px; padding: 12px;">
            <h4 style="color: #64C864; margin-top: 0; font-size: 14px; text-align: center;">Reasonable Privacy</h4>
            <ul style="padding-left: 20px; font-size: 12px;">
              <li>Details known to participants</li>
              <li>Verification without revealing all</li>
              <li>Oversight with due process</li>
            </ul>
          </div>
          
          <div style="background-color: rgba(100, 100, 255, 0.15); border-radius: 6px; padding: 12px;">
            <h4 style="color: #6464FF; margin-top: 0; font-size: 14px; text-align: center;">Absolute Privacy</h4>
            <ul style="padding-left: 20px; font-size: 12px;">
              <li>No transaction trail</li>
              <li>Completely anonymous</li>
              <li>No possible oversight</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div style="background-color: rgba(255, 204, 0, 0.07); border-radius: 8px; padding: 16px;">
        <h2 style="color: #FFA500; margin-top: 0; text-align: center;">Key Questions</h2>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-top: 16px;">
          <div style="background-color: rgba(0, 0, 0, 0.1); border-radius: 6px; padding: 12px; display: flex; align-items: center; gap: 10px;">
            <div style="font-size: 24px;">❓</div>
            <div>Who should access your transaction history?</div>
          </div>
          
          <div style="background-color: rgba(0, 0, 0, 0.1); border-radius: 6px; padding: 12px; display: flex; align-items: center; gap: 10px;">
            <div style="font-size: 24px;">🔐</div>
            <div>Is financial privacy a right or privilege?</div>
          </div>
          
          <div style="background-color: rgba(0, 0, 0, 0.1); border-radius: 6px; padding: 12px; display: flex; align-items: center; gap: 10px;">
            <div style="font-size: 24px;">🛡️</div>
            <div>How to prevent crimes while respecting privacy?</div>
          </div>
          
          <div style="background-color: rgba(0, 0, 0, 0.1); border-radius: 6px; padding: 12px; display: flex; align-items: center; gap: 10px;">
            <div style="font-size: 24px;">📋</div>
            <div>What information should different transactions require?</div>
          </div>
        </div>
      </div>
    `,
    completed: undefined
  },
  {
    id: 105,
    title: "CBDCs and Privacy",
    subtitle: "The future of government-issued digital money",
    description: "Understand how Central Bank Digital Currencies might affect financial privacy.",
    simulationType: 'cbdc',
    content: `
      <div style="background-color: rgba(255, 204, 0, 0.1); border-radius: 8px; padding: 20px; margin-bottom: 24px;">
      <img src="https://bitcoiners.africa/wp-content/uploads/2025/06/Realm-2-CBDCs-and-Privacy.png" 
        alt="Everyday Bitcoin Tools" 
        style="position: relative; z-index: 1; width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 16px;">
        <h2 style="color: #FFA500; margin-top: 0; text-align: center;">Enter CBDCs: Central Bank Digital Currencies</h2>
        
        <p style="margin-bottom: 20px;">Many governments are building <strong>CBDCs</strong> — digital versions of their currency that give them even more control than traditional banking systems.</p>
        
        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; margin-bottom: 24px;">
          <div style="flex: 1; min-width: 250px; max-width: 400px; background-color: rgba(0, 0, 0, 0.2); border-radius: 8px; padding: 16px; text-align: center;">
            <div style="font-size: 32px; margin-bottom: 12px;">📱</div>
            <p style="margin: 0; font-weight: bold; color: #FFCC00;">What Are CBDCs?</p>
            <p style="margin-top: 8px;">Digital versions of national currencies issued and regulated directly by a country's central bank</p>
          </div>
        </div>
      </div>
      
      <div style="background-color: rgba(255, 204, 0, 0.1); border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <h2 style="color: #FFA500; margin-top: 0;">In Everyday Terms</h2>
        
        <p>Imagine if your country's paper money (like dollars, naira, or shillings) became completely digital, but unlike private cryptocurrencies like Bitcoin:</p>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-top: 16px;">
          <div style="background-color: rgba(0, 0, 0, 0.2); border-radius: 8px; padding: 16px;">
            <div style="font-size: 28px; margin-bottom: 8px; text-align: center;">🏦</div>
            <p style="margin: 0; text-align: center;">Created and controlled by your government's central bank</p>
          </div>
          
          <div style="background-color: rgba(0, 0, 0, 0.2); border-radius: 8px; padding: 16px;">
            <div style="font-size: 28px; margin-bottom: 8px; text-align: center;">💵</div>
            <p style="margin: 0; text-align: center;">Same value as physical currency</p>
          </div>
          
          <div style="background-color: rgba(0, 0, 0, 0.2); border-radius: 8px; padding: 16px;">
            <div style="font-size: 28px; margin-bottom: 8px; text-align: center;">🔄</div>
            <p style="margin: 0; text-align: center;">Works within the existing financial system</p>
          </div>
          
          <div style="background-color: rgba(0, 0, 0, 0.2); border-radius: 8px; padding: 16px;">
            <div style="font-size: 28px; margin-bottom: 8px; text-align: center;">⚙️</div>
            <p style="margin: 0; text-align: center;">Can be programmed with specific rules</p>
          </div>
        </div>
      </div>
      
      <div style="background-color: rgba(255, 204, 0, 0.05); border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <h2 style="color: #FFA500; margin-top: 0;">Enhanced Control Features</h2>
        
        <p style="margin-bottom: 16px;">With CBDCs, central authorities can:</p>
        
        <div style="display: grid; grid-template-columns: 1fr; gap: 12px; margin-bottom: 16px;">
          <div style="background-color: rgba(255, 100, 100, 0.1); border-radius: 6px; padding: 12px; display: flex; align-items: center;">
            <div style="font-size: 20px; margin-right: 12px;">👁️</div>
            <div><strong>Track every single coin</strong> - See exactly where and how you spend</div>
          </div>
          
          <div style="background-color: rgba(255, 100, 100, 0.1); border-radius: 6px; padding: 12px; display: flex; align-items: center;">
            <div style="font-size: 20px; margin-right: 12px;">❄️</div>
            <div><strong>Freeze your money instantly</strong> - No court order needed</div>
          </div>
          
          <div style="background-color: rgba(255, 100, 100, 0.1); border-radius: 6px; padding: 12px; display: flex; align-items: center;">
            <div style="font-size: 20px; margin-right: 12px;">🚫</div>
            <div><strong>Decide what your money can be spent on</strong> - Limiting purchases by category or vendor</div>
          </div>
          
          <div style="background-color: rgba(255, 100, 100, 0.1); border-radius: 6px; padding: 12px; display: flex; align-items: center;">
            <div style="font-size: 20px; margin-right: 12px;">⏱️</div>
            <div><strong>Set an expiry date</strong> - Use it or lose it by a certain date</div>
          </div>
        </div>
        
        <div style="background-color: rgba(0, 0, 0, 0.1); border-radius: 6px; padding: 12px; margin-top: 16px;">
          <p style="margin: 0; font-style: italic;">Example: In a CBDC world, your government could stop you from donating to a protest, buying too much fuel, or even force you to spend your money before the month ends.</p>
        </div>
      </div>
      
      <div style="background-color: rgba(255, 204, 0, 0.1); border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <h2 style="color: #FFA500; margin-top: 0;">Real-Life Examples</h2>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-top: 16px;">
          <div style="background-color: rgba(0, 0, 0, 0.15); border-radius: 8px; padding: 16px; border-left: 4px solid #00AA00;">
            <h3 style="color: #FFCC00; margin-top: 0; font-size: 18px;">Nigeria's eNaira</h3>
            <p style="margin-bottom: 0;">Africa's first CBDC, launched in 2021, allows citizens to make digital payments directly through the central bank</p>
          </div>
          
          <div style="background-color: rgba(0, 0, 0, 0.15); border-radius: 8px; padding: 16px; border-left: 4px solid #FF0000;">
            <h3 style="color: #FFCC00; margin-top: 0; font-size: 18px;">China's Digital Yuan</h3>
            <p style="margin-bottom: 0;">Being tested in major cities, allowing payment via mobile apps and even without internet connection</p>
          </div>
          
          <div style="background-color: rgba(0, 0, 0, 0.15); border-radius: 8px; padding: 16px; border-left: 4px solid #FFA500;">
            <h3 style="color: #FFCC00; margin-top: 0; font-size: 18px;">Ghana's e-Cedi</h3>
            <p style="margin-bottom: 0;">In development to improve financial inclusion and reduce the costs of cash</p>
          </div>
        </div>
      </div>
      
      <div style="background-color: rgba(255, 204, 0, 0.07); border-radius: 8px; padding: 20px;">
        <h2 style="color: #FFA500; margin-top: 0; text-align: center;">The Privacy Concern</h2>
        
        <div style="display: flex; justify-content: center; margin: 24px 0;">
          <div style="max-width: 80%; padding: 16px; background-color: rgba(255, 100, 100, 0.1); border-radius: 8px; text-align: center; font-style: italic;">
            They say it's for "security" and "efficiency." But at what cost?
          </div>
        </div>
        
        <div style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: center;">
          <div style="flex: 1; min-width: 200px; max-width: 300px; text-align: center;">
            <div style="width: 70px; height: 70px; border-radius: 50%; background-color: rgba(255, 204, 0, 0.2); display: flex; align-items: center; justify-content: center; font-size: 32px; margin: 0 auto 12px auto;">
              🔒
            </div>
            <h3 style="color: #FFCC00; margin: 0 0 8px 0;">Privacy</h3>
            <p style="margin: 0; font-size: 14px;">The right to financial autonomy without surveillance</p>
          </div>
          
          <div style="flex: 1; min-width: 200px; max-width: 300px; text-align: center;">
            <div style="width: 70px; height: 70px; border-radius: 50%; background-color: rgba(255, 204, 0, 0.2); display: flex; align-items: center; justify-content: center; font-size: 32px; margin: 0 auto 12px auto;">
              ⚖️
            </div>
            <h3 style="color: #FFCC00; margin: 0 0 8px 0;">Control</h3>
            <p style="margin: 0; font-size: 14px;">The power to make your own financial choices</p>
          </div>
          
          <div style="flex: 1; min-width: 200px; max-width: 300px; text-align: center;">
            <div style="width: 70px; height: 70px; border-radius: 50%; background-color: rgba(255, 204, 0, 0.2); display: flex; align-items: center; justify-content: center; font-size: 32px; margin: 0 auto 12px auto;">
              🔍
            </div>
            <h3 style="color: #FFCC00; margin: 0 0 8px 0;">Transparency</h3>
            <p style="margin: 0; font-size: 14px;">Being able to verify the monetary system yourself</p>
          </div>
        </div>
      </div>
    `,
    completed: undefined
  },
  {
    id: 106,
    title: "Bitcoin's Transparency",
    subtitle: "Public but private: How Bitcoin balances openness with freedom",
    description: "Discover how Bitcoin's transparent ledger protects your privacy while ensuring accountability.",
    simulationType: 'bitcoin',
    content: `
      <div style="background-color: rgba(0, 0, 0, 0.03); border: 1px solid rgba(255, 153, 0, 0.3); border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <img src="https://bitcoiners.africa/wp-content/uploads/2025/06/Realm-2-Bitcoins-Transparency.png" 
          alt="Bitcoin Transparency" 
          style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 16px;">
        
        <h2 style="color: #FF9900; margin-top: 0; text-align: center;">Bitcoin: The See-Through Safe</h2>
        
        <div style="background-color: rgba(255, 153, 0, 0.1); border-radius: 8px; padding: 16px; margin: 20px 0;">
          <p style="margin: 0; text-align: center; font-size: 18px;">
            <em>"A system where everyone can verify the rules, but no one can see your business unless you choose to show it."</em>
          </p>
        </div>
        
        <p style="margin-bottom: 20px;">
          Bitcoin's blockchain is like a <strong>glass vault</strong> - everyone can see the structure and verify its integrity, but your personal transactions remain pseudonymous unless you reveal your identity.
        </p>
      </div>
  
      <!-- Core Transparency Features -->
      <div style="background-color: rgba(0, 0, 0, 0.03); border: 1px solid rgba(255, 153, 0, 0.3); border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <h2 style="color: #FF9900; margin-top: 0; border-bottom: 2px solid rgba(255, 153, 0, 0.3); padding-bottom: 8px;">Three Layers of Transparency</h2>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-top: 16px;">
          <!-- Layer 1 -->
          <div style="background: linear-gradient(to bottom, rgba(255,153,0,0.1), transparent); border-radius: 8px; padding: 16px; text-align: center;">
            <div style="font-size: 40px; margin-bottom: 12px;">🔍</div>
            <h3 style="color: #FFCC00; margin-top: 0;">Public Ledger</h3>
            <p style="margin-bottom: 0;">
              Every transaction is recorded on the blockchain for anyone to verify - no hidden money creation or secret spending
            </p>
          </div>
          
          <!-- Layer 2 -->
          <div style="background: linear-gradient(to bottom, rgba(255,153,0,0.1), transparent); border-radius: 8px; padding: 16px; text-align: center;">
            <div style="font-size: 40px; margin-bottom: 12px;">👤</div>
            <h3 style="color: #FFCC00; margin-top: 0;">Pseudonymity</h3>
            <p style="margin-bottom: 0;">
              Your identity isn't tied to wallet addresses unless you choose to reveal it
            </p>
          </div>
          
          <!-- Layer 3 -->
          <div style="background: linear-gradient(to bottom, rgba(255,153,0,0.1), transparent); border-radius: 8px; padding: 16px; text-align: center;">
            <div style="font-size: 40px; margin-bottom: 12px;">⚙️</div>
            <h3 style="color: #FFCC00; margin-top: 0;">Open Rules</h3>
            <p style="margin-bottom: 0;">
              The monetary policy (21 million cap) and transaction rules are visible to all and can't be changed secretly
            </p>
          </div>
        </div>
      </div>
  
      <!-- How It Works Section -->
      <div style="background-color: rgba(0, 0, 0, 0.03); border: 1px solid rgba(255, 153, 0, 0.3); border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <h2 style="color: #FF9900; margin-top: 0;">The Privacy Paradox Solved</h2>
        
        <div style="display: flex; align-items: center; gap: 20px; margin: 24px 0; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 200px;">
            <p style="margin-bottom: 16px;">
              Unlike traditional finance where institutions see everything but users see nothing, Bitcoin <strong>flips this model</strong>:
            </p>
            
            <div style="background-color: rgba(0, 0, 0, 0.1); border-radius: 6px; padding: 12px; margin-bottom: 12px;">
              <p style="margin: 0; font-weight: bold; color: #FFCC00;">Traditional Banking</p>
              <p style="margin: 8px 0 0 0;">Institutions see all your transactions → You see nothing of their operations</p>
            </div>
            
            <div style="background-color: rgba(0, 153, 102, 0.1); border-radius: 6px; padding: 12px;">
              <p style="margin: 0; font-weight: bold; color: #00AA00;">Bitcoin</p>
              <p style="margin: 8px 0 0 0;">No one sees your identity → Everyone sees the system's integrity</p>
            </div>
          </div>
          
          <div style="flex: 1; min-width: 200px; text-align: center;">
            <div style="font-size: 80px;">🔄</div>
          </div>
        </div>
        
        <div style="background-color: rgba(255, 153, 0, 0.1); border-left: 4px solid #FF9900; padding: 12px; margin-top: 16px;">
          <p style="margin: 0; font-style: italic;">
            "Bitcoin gives you the receipts to audit the system while keeping your personal transactions discreet."
          </p>
        </div>
      </div>
  
      <!-- Practical Examples -->
      <div style="background-color: rgba(0, 0, 0, 0.03); border: 1px solid rgba(255, 153, 0, 0.3); border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <h2 style="color: #FF9900; margin-top: 0;">Transparency In Action</h2>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-top: 16px;">
          <div style="background-color: rgba(0, 0, 0, 0.15); border-radius: 8px; padding: 16px; border-left: 4px solid #009900;">
            <h3 style="color: #FFCC00; margin-top: 0; font-size: 18px;">Charity Audits</h3>
            <p style="margin-bottom: 0;">Nonprofits can prove exactly how donations are spent without revealing donor identities</p>
          </div>
          
          <div style="background-color: rgba(0, 0, 0, 0.15); border-radius: 8px; padding: 16px; border-left: 4px solid #006600;">
            <h3 style="color: #FFCC00; margin-top: 0; font-size: 18px;">Business Payments</h3>
            <p style="margin-bottom: 0;">Companies can verify supplier payments while keeping internal accounting private</p>
          </div>
          
          <div style="background-color: rgba(0, 0, 0, 0.15); border-radius: 8px; padding: 16px; border-left: 4px solid #003300;">
            <h3 style="color: #FFCC00; margin-top: 0; font-size: 18px;">Personal Finance</h3>
            <p style="margin-bottom: 0;">You can prove transactions occurred without exposing your full financial history</p>
          </div>
        </div>
      </div>
  
      <!-- Empowerment Section -->
      <div style="background-color: rgba(255, 153, 0, 0.05); border-radius: 8px; padding: 20px;">
        <h2 style="color: #FF9900; margin-top: 0; text-align: center;">Your Transparency Toolkit</h2>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 24px 0;">
          <div style="text-align: center;">
            <div style="width: 80px; height: 80px; background-color: rgba(255, 153, 0, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px auto; font-size: 32px;">
              🌐
            </div>
            <h3 style="color: #FFCC00; margin: 0 0 8px 0;">Block Explorers</h3>
            <p style="margin: 0; font-size: 14px;">Public tools to verify any transaction</p>
          </div>
          
          <div style="text-align: center;">
            <div style="width: 80px; height: 80px; background-color: rgba(255, 153, 0, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px auto; font-size: 32px;">
              🛡️
            </div>
            <h3 style="color: #FFCC00; margin: 0 0 8px 0;">Privacy Wallets</h3>
            <p style="margin: 0; font-size: 14px;">Generate new addresses for each transaction</p>
          </div>
          
          <div style="text-align: center;">
            <div style="width: 80px; height: 80px; background-color: rgba(255, 153, 0, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px auto; font-size: 32px;">
              📊
            </div>
            <h3 style="color: #FFCC00; margin: 0 0 8px 0;">Audit Tools</h3>
            <p style="margin: 0; font-size: 14px;">Verify your own transaction history</p>
          </div>
        </div>
      </div>    

        <div style="background-color: rgba(255, 153, 0, 0.05); border-radius: 8px; padding: 20px; margin-top: 24px;">
          <h2 style="color: #FF9900; margin-top: 0; text-align: center;">Wait... What Is This Bitcoin Thing Anyway?</h2>
          
          <div style="display: flex; align-items: center; gap: 20px; margin: 24px 0; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 200px;">
              <p style="margin-bottom: 16px;">
                <em>"If you don't believe me or don't get it, I don't have time to try to convince you, sorry."</em><br>
                <span style="display: inline-block; margin-top: 8px; font-weight: bold;">— Satoshi Nakamoto (2010)</span>
              </p>
              
              <p>While we've been talking about Bitcoin's features, you might be wondering: <strong>Where did this mysterious money come from?</strong></p>
            </div>
            <div style="flex: 1; min-width: 200px; text-align: center;">
              <div style="font-size: 60px;">🤔</div>
            </div>
          </div>
          
          <div style="background-color: rgba(0, 0, 0, 0.1); border-radius: 8px; padding: 16px; margin: 20px 0;">
            <h3 style="color: #FFCC00; margin-top: 0;">October 31, 2008: A Financial Revolution Begins</h3>
            <img src="https://bitcoiners.africa/wp-content/uploads/2025/06/bankbaillout.jpg" 
              alt="2008 Financial Crisis Headlines" 
              style="width: 100%; border-radius: 8px; margin: 12px 0;">
            <p>As banks collapsed and governments bailed out financial institutions, an anonymous person (or group) named <strong>Satoshi Nakamoto</strong> published the Bitcoin whitepaper.</p>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-top: 16px;">
              <div style="background-color: rgba(0, 0, 0, 0.15); border-radius: 6px; padding: 12px;">
                <div style="font-size: 24px; margin-bottom: 8px;">👤</div>
                <p style="margin: 0; font-size: 14px;"><strong>Anonymous Creator:</strong> Satoshi's true identity remains unknown</p>
              </div>
              <div style="background-color: rgba(0, 0, 0, 0.15); border-radius: 6px; padding: 12px;">
                <div style="font-size: 24px; margin-bottom: 8px;">📜</div>
                <p style="margin: 0; font-size: 14px;"><strong>9-Page Whitepaper:</strong> Explained a peer-to-peer electronic cash system</p>
              </div>
              <div style="background-color: rgba(0, 0, 0, 0.15); border-radius: 6px; padding: 12px;">
                <div style="font-size: 24px; margin-bottom: 8px;">💻</div>
                <p style="margin: 0; font-size: 14px;"><strong>Jan 2009:</strong> Network launched with first block ("Genesis Block")</p>
              </div>
            </div>
          </div>
          
          <div style="background-color: rgba(255, 153, 0, 0.1); border-left: 4px solid #FF9900; padding: 12px; margin: 20px 0;">
            <p style="margin: 0;">
              <strong>Fun Fact:</strong> Satoshi embedded a <strong>hidden message</strong> in Bitcoin's first block:<br>
              <em>"The Times 03/Jan/2009 Chancellor on brink of second bailout for banks"</em> - a headline from that day's London Times.
              <img src="https://bitcoiners.africa/wp-content/uploads/2025/06/genesisblock.jpg" 
              alt="2008 Financial Crisis Headlines" 
              style="width: 100%; border-radius: 8px; margin: 12px 0;">
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 24px;">
            <a href="https://bitcoiners.africa/learn-bitcoin/bitcoin-whitepaper/" style="display: inline-block; background-color: #FF9900; color: black; padding: 12px 24px; border-radius: 30px; font-weight: bold; text-decoration: none; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              Read the Original Whitepaper 📄
            </a>
            <p style="font-size: 14px; margin-top: 12px;">
              Don't worry if you don't understand it all - that's why you're here! 😉
            </p>
          </div>
        </div>
    `,
    completed: undefined
  },
  {
    id: 107,
    title: "Self-Custody",
    subtitle: "Taking control of your financial sovereignty",
    description: "Explore why \"not your keys, not your coins\" matters for financial sovereignty.",
    simulationType: 'selfcustody',
    content: `
      <div style="background-color: rgba(255, 204, 0, 0.1); border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <h2 style="color: #FFA500; margin-top: 0; text-align: center;">Not Your Keys, Not Your Coins</h2>
        <img src="https://bitcoiners.africa/wp-content/uploads/2025/06/Realm-2-Self-Custody.png" 
        alt="Everyday Bitcoin Tools" 
        style="position: relative; z-index: 1; width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 16px;">
        <div style="background-color: rgba(0, 0, 0, 0.15); border-radius: 8px; padding: 16px; margin: 16px 0; text-align: center;">
          <p style="font-size: 18px; font-weight: bold; margin: 0; color: #FFCC00;">Self-custody means holding your own keys rather than trusting third parties with your money</p>
        </div>
        
        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; margin: 24px 0;">
          <div style="flex: 1; min-width: 250px; max-width: 400px; background-color: rgba(0, 0, 0, 0.2); border-radius: 8px; padding: 16px; text-align: center;">
            <div style="font-size: 32px; margin-bottom: 12px;">🏦</div>
            <h3 style="color: #FFCC00; margin: 0 0 8px 0;">Custodial Services</h3>
            <p style="margin: 0;">When you trust banks, exchanges or companies to hold your money</p>
          </div>
          
          <div style="flex: 1; min-width: 250px; max-width: 400px; background-color: rgba(0, 0, 0, 0.2); border-radius: 8px; padding: 16px; text-align: center;">
            <div style="font-size: 32px; margin-bottom: 12px;">🔑</div>
            <h3 style="color: #FFCC00; margin: 0 0 8px 0;">Self-Custody</h3>
            <p style="margin: 0;">When you control your own private keys and directly own your money</p>
          </div>
        </div>
      </div>
      
      <div style="background-color: rgba(255, 204, 0, 0.05); border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <h2 style="color: #FFA500; margin-top: 0;">Why Self-Custody Matters</h2>
        
        <p style="margin-bottom: 16px;">When you keep money in banks or centralized services, you're subject to their rules:</p>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 20px;">
          <div style="background-color: rgba(255, 100, 100, 0.1); border-radius: 6px; padding: 12px; display: flex; align-items: center;">
            <div style="font-size: 20px; margin-right: 12px;">❄️</div>
            <div><strong>Accounts can be frozen</strong> without your permission</div>
          </div>
          
          <div style="background-color: rgba(255, 100, 100, 0.1); border-radius: 6px; padding: 12px; display: flex; align-items: center;">
            <div style="font-size: 20px; margin-right: 12px;">💸</div>
            <div><strong>Funds can be seized</strong> by authorities or creditors</div>
          </div>
          
          <div style="background-color: rgba(255, 100, 100, 0.1); border-radius: 6px; padding: 12px; display: flex; align-items: center;">
            <div style="font-size: 20px; margin-right: 12px;">🚫</div>
            <div><strong>Transactions can be blocked</strong> or reversed</div>
          </div>
          
          <div style="background-color: rgba(255, 100, 100, 0.1); border-radius: 6px; padding: 12px; display: flex; align-items: center;">
            <div style="font-size: 20px; margin-right: 12px;">👁️</div>
            <div><strong>Financial privacy is lost</strong> to surveillance</div>
          </div>
        </div>
      </div>
      
      <div style="background-color: rgba(255, 204, 0, 0.1); border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <h2 style="color: #FFA500; margin-top: 0; text-align: center;">Self-Custody Tools</h2>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-top: 16px;">
          <div style="background-color: rgba(0, 0, 0, 0.15); border-radius: 8px; padding: 16px; text-align: center;">
            <div style="font-size: 28px; margin-bottom: 8px;">🗝️</div>
            <h3 style="color: #FFCC00; margin: 0 0 8px 0;">Private Keys</h3>
            <p style="margin: 0; font-size: 14px;">Secret codes that prove and control ownership of your funds</p>
          </div>
          
          <div style="background-color: rgba(0, 0, 0, 0.15); border-radius: 8px; padding: 16px; text-align: center;">
            <div style="font-size: 28px; margin-bottom: 8px;">📝</div>
            <h3 style="color: #FFCC00; margin: 0 0 8px 0;">Seed Phrases</h3>
            <p style="margin: 0; font-size: 14px;">12-24 words that can recover all your keys</p>
          </div>
          
          <div style="background-color: rgba(0, 0, 0, 0.15); border-radius: 8px; padding: 16px; text-align: center;">
            <div style="font-size: 28px; margin-bottom: 8px;">🔒</div>
            <h3 style="color: #FFCC00; margin: 0 0 8px 0;">Hardware Wallets</h3>
            <p style="margin: 0; font-size: 14px;">Physical devices that securely store your keys</p>
          </div>
          
          <div style="background-color: rgba(0, 0, 0, 0.15); border-radius: 8px; padding: 16px; text-align: center;">
            <div style="font-size: 28px; margin-bottom: 8px;">📱</div>
            <h3 style="color: #FFCC00; margin: 0 0 8px 0;">Software Wallets</h3>
            <p style="margin: 0; font-size: 14px;">Apps on your phone or computer that manage keys</p>
          </div>
        </div>
      </div>
      
      <div style="background-color: rgba(255, 204, 0, 0.07); border-radius: 8px; padding: 20px;">
        <h2 style="color: #FFA500; margin-top: 0; text-align: center;">The Sovereignty Trade-off</h2>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 16px;">
          <div style="background-color: rgba(0, 200, 0, 0.1); border-radius: 8px; padding: 16px;">
            <h3 style="color: #FFCC00; margin-top: 0; text-align: center;">Benefits</h3>
            <ul style="margin-bottom: 0; padding-left: 20px;">
              <li>Complete ownership of your money</li>
              <li>Immunity from account freezes or censorship</li>
              <li>Privacy from financial surveillance</li>
              <li>Protection against third-party risk</li>
              <li>Independence from institutional control</li>
            </ul>
          </div>
          
          <div style="background-color: rgba(255, 100, 100, 0.1); border-radius: 8px; padding: 16px;">
            <h3 style="color: #FFCC00; margin-top: 0; text-align: center;">Responsibilities</h3>
            <ul style="margin-bottom: 0; padding-left: 20px;">
              <li>Secure key management</li>
              <li>Backup and recovery procedures</li>
              <li>Protection against theft or loss</li>
              <li>No "customer service" to help if mistakes are made</li>
              <li>Personal responsibility for security</li>
            </ul>
          </div>
        </div>
        
        <div style="background-color: rgba(0, 0, 0, 0.1); border-radius: 6px; padding: 12px; margin-top: 16px; text-align: center;">
          <p style="margin: 0; font-style: italic;">True financial freedom requires taking personal responsibility for your money</p>
        </div>
      </div>
    `,
    completed: undefined
  }
];