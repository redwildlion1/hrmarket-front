export interface BlogTemplate {
  id: string
  name: string
  description: string
  preview: string
  category: "professional" | "creative" | "minimal" | "vibrant" | "tech" | "editorial" | "corporate-event"
  html: string
}

export const blogTemplates: BlogTemplate[] = [
  {
    id: "corporate-professional",
    name: "Corporate Professional",
    description: "Clean, minimal design perfect for corporate communications and professional HR content",
    category: "professional",
    preview: "🏢",
    html: `
<div style="font-family: 'Inter', sans-serif; color: #1e293b;">
  <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 4rem 3rem; border-radius: 0.75rem; margin-bottom: 3rem;">
    <p style="color: #93c5fd; text-transform: uppercase; font-size: 0.875rem; font-weight: 600; letter-spacing: 0.125rem; margin-bottom: 1rem;">HR INSIGHTS • PROFESSIONAL DEVELOPMENT</p>
    <h1 style="color: white; font-size: 3rem; font-weight: 800; line-height: 1.2; margin-bottom: 1.5rem;">Transforming Workplace Culture: A Strategic HR Perspective</h1>
    <p style="color: #dbeafe; font-size: 1.25rem; line-height: 1.6; margin-bottom: 2rem;">Exploring evidence-based approaches to building high-performance teams and sustainable organizational culture in modern enterprises.</p>
    <div style="display: flex; gap: 2rem; align-items: center; color: #bfdbfe; font-size: 0.875rem;">
      <span>📅 January 2025</span>
      <span>•</span>
      <span>⏱️ 8 min read</span>
      <span>•</span>
      <span>👤 HR Leadership Team</span>
    </div>
  </div>
  
  <div style="max-width: 800px; margin: 0 auto;">
    <p style="font-size: 1.125rem; line-height: 1.8; color: #475569; margin-bottom: 2rem;">In today's rapidly evolving business landscape, human resources professionals face unprecedented challenges in attracting, retaining, and developing top talent. The traditional approaches to HR management are no longer sufficient in an era defined by remote work, digital transformation, and shifting employee expectations.</p>
    
    <p style="font-size: 1.125rem; line-height: 1.8; color: #475569; margin-bottom: 2rem;">This comprehensive guide explores strategic frameworks that forward-thinking organizations are implementing to stay competitive, foster innovation, and create workplaces where employees can truly thrive.</p>
    
    <h2 style="color: #1e40af; font-size: 2rem; font-weight: 700; margin-top: 3rem; margin-bottom: 1.5rem; border-bottom: 3px solid #3b82f6; padding-bottom: 0.75rem;">The Evolution of Modern HR Practices</h2>
    
    <p style="font-size: 1.125rem; line-height: 1.8; color: #475569; margin-bottom: 2rem;">Human resources has undergone a remarkable transformation over the past decade. What was once primarily an administrative function focused on payroll and compliance has evolved into a strategic business partner that drives organizational success. This shift reflects a fundamental recognition: people are truly an organization's most valuable asset.</p>
    
    <div style="background: #f1f5f9; padding: 2rem; border-left: 4px solid #3b82f6; border-radius: 0.5rem; margin: 2.5rem 0;">
      <h3 style="color: #1e40af; font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem;">💡 Key Insight</h3>
      <p style="font-size: 1rem; line-height: 1.7; color: #475569; margin: 0;">Organizations that invest in comprehensive people strategies see up to 40% higher employee engagement and 25% better business outcomes compared to those with traditional HR approaches.</p>
    </div>
    
    <h2 style="color: #1e40af; font-size: 2rem; font-weight: 700; margin-top: 3rem; margin-bottom: 1.5rem; border-bottom: 3px solid #3b82f6; padding-bottom: 0.75rem;">Five Pillars of Exceptional Workplace Culture</h2>
    
    <h3 style="color: #334155; font-size: 1.5rem; font-weight: 600; margin-top: 2rem; margin-bottom: 1rem;">1. Transparent Communication</h3>
    <p style="font-size: 1.125rem; line-height: 1.8; color: #475569; margin-bottom: 1.5rem;">Building trust starts with open, honest communication at all organizational levels. This means regular town halls, accessible leadership, clear goal-setting, and channels for anonymous feedback. When employees understand the company's vision and their role in achieving it, engagement naturally follows.</p>
    
    <h3 style="color: #334155; font-size: 1.5rem; font-weight: 600; margin-top: 2rem; margin-bottom: 1rem;">2. Continuous Learning & Development</h3>
    <p style="font-size: 1.125rem; line-height: 1.8; color: #475569; margin-bottom: 1.5rem;">Today's workforce expects growth opportunities. Organizations must provide clear career paths, skill development programs, mentorship opportunities, and resources for continuous learning. This investment in people development pays dividends in retention and performance.</p>
    
    <h3 style="color: #334155; font-size: 1.5rem; font-weight: 600; margin-top: 2rem; margin-bottom: 1rem;">3. Recognition & Appreciation</h3>
    <p style="font-size: 1.125rem; line-height: 1.8; color: #475569; margin-bottom: 1.5rem;">A culture of recognition goes beyond annual reviews. Implement peer-to-peer recognition programs, celebrate wins publicly, and ensure that contributions at all levels are acknowledged. Recognition doesn't always need to be monetary—sometimes a sincere thank you is the most powerful motivator.</p>
    
    <h3 style="color: #334155; font-size: 1.5rem; font-weight: 600; margin-top: 2rem; margin-bottom: 1rem;">4. Work-Life Integration</h3>
    <p style="font-size: 1.125rem; line-height: 1.8; color: #475569; margin-bottom: 1.5rem;">The concept of work-life balance has evolved into work-life integration. Modern employees seek flexibility to manage personal responsibilities alongside professional commitments. Companies that embrace hybrid work, flexible hours, and results-oriented work environments attract and retain top talent.</p>
    
    <h3 style="color: #334155; font-size: 1.5rem; font-weight: 600; margin-top: 2rem; margin-bottom: 1rem;">5. Diversity, Equity & Inclusion</h3>
    <p style="font-size: 1.125rem; line-height: 1.8; color: #475569; margin-bottom: 2rem;">Creating truly inclusive workplaces requires intentional effort. This means diverse hiring practices, equitable pay structures, inclusive policies, and continuous education. Organizations with strong DEI commitments outperform their peers and create more innovative, resilient teams.</p>
    
    <div style="background: linear-gradient(135deg, #eff6ff, #dbeafe); padding: 2.5rem; border-radius: 0.75rem; margin: 3rem 0;">
      <h3 style="color: #1e40af; font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem;">📊 By the Numbers</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem;">
        <div>
          <p style="color: #1e40af; font-size: 2.5rem; font-weight: 800; margin-bottom: 0.5rem;">87%</p>
          <p style="color: #475569; font-size: 0.875rem; line-height: 1.5; margin: 0;">of employees would stay at their company longer if they felt their contributions were recognized</p>
        </div>
        <div>
          <p style="color: #1e40af; font-size: 2.5rem; font-weight: 800; margin-bottom: 0.5rem;">94%</p>
          <p style="color: #475569; font-size: 0.875rem; line-height: 1.5; margin: 0;">of executives believe a distinct workplace culture is important to business success</p>
        </div>
        <div>
          <p style="color: #1e40af; font-size: 2.5rem; font-weight: 800; margin-bottom: 0.5rem;">3.5x</p>
          <p style="color: #475569; font-size: 0.875rem; line-height: 1.5; margin: 0;">higher revenue growth for companies with strong learning cultures</p>
        </div>
      </div>
    </div>
    
    <h2 style="color: #1e40af; font-size: 2rem; font-weight: 700; margin-top: 3rem; margin-bottom: 1.5rem; border-bottom: 3px solid #3b82f6; padding-bottom: 0.75rem;">Implementing Change: A Practical Roadmap</h2>
    
    <p style="font-size: 1.125rem; line-height: 1.8; color: #475569; margin-bottom: 2rem;">Transforming organizational culture is a journey, not a destination. Here's a practical approach to getting started:</p>
    
    <ol style="font-size: 1.125rem; line-height: 1.8; color: #475569; margin-bottom: 2rem; padding-left: 2rem;">
      <li style="margin-bottom: 1rem;"><strong>Assess Current State:</strong> Conduct employee surveys, focus groups, and exit interviews to understand your current culture and identify gaps.</li>
      <li style="margin-bottom: 1rem;"><strong>Define Your Vision:</strong> Work with leadership to articulate the desired culture. What values do you want to embody? What behaviors should be celebrated?</li>
      <li style="margin-bottom: 1rem;"><strong>Build Your Strategy:</strong> Develop concrete initiatives aligned with your vision. Assign ownership, set timelines, and allocate resources.</li>
      <li style="margin-bottom: 1rem;"><strong>Communicate Relentlessly:</strong> Share the vision, explain the why, celebrate progress, and maintain momentum through consistent communication.</li>
      <li style="margin-bottom: 1rem;"><strong>Measure & Iterate:</strong> Track key metrics, gather feedback, and refine your approach based on what you learn.</li>
    </ol>
    
    <h2 style="color: #1e40af; font-size: 2rem; font-weight: 700; margin-top: 3rem; margin-bottom: 1.5rem; border-bottom: 3px solid #3b82f6; padding-bottom: 0.75rem;">Looking Ahead</h2>
    
    <p style="font-size: 1.125rem; line-height: 1.8; color: #475569; margin-bottom: 2rem;">The future of work will continue to evolve, bringing new challenges and opportunities. Artificial intelligence, changing generational expectations, and global workforce dynamics will reshape how we think about HR. However, one constant remains: organizations that prioritize their people will always have a competitive advantage.</p>
    
    <p style="font-size: 1.125rem; line-height: 1.8; color: #475569; margin-bottom: 3rem;">By embracing these principles and committing to continuous improvement, HR leaders can create workplaces where people don't just work—they thrive, innovate, and contribute to building something truly extraordinary.</p>
    
    <div style="background: #1e40af; color: white; padding: 2.5rem; border-radius: 0.75rem; margin-top: 3rem;">
      <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem;">Ready to Transform Your Workplace?</h3>
      <p style="font-size: 1rem; line-height: 1.7; margin-bottom: 1.5rem; opacity: 0.95;">Connect with our HR consulting team to develop a customized strategy for your organization.</p>
      <a href="#" style="display: inline-block; background: white; color: #1e40af; padding: 0.75rem 2rem; border-radius: 0.5rem; font-weight: 600; text-decoration: none;">Get Started Today</a>
    </div>
  </div>
</div>
    `,
  },
  {
    id: "creative-agency",
    name: "Creative Agency",
    description: "Bold, colorful design for innovative HR practices and creative workplace culture",
    category: "creative",
    preview: "🎨",
    html: `
<div style="font-family: 'Inter', sans-serif;">
  <div style="background: linear-gradient(135deg, #ec4899 0%, #f59e0b 50%, #8b5cf6 100%); padding: 5rem 3rem; position: relative; overflow: hidden;">
    <div style="position: absolute; top: -50%; right: -10%; width: 500px; height: 500px; background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%); border-radius: 50%;"></div>
    <div style="position: absolute; bottom: -30%; left: -5%; width: 400px; height: 400px; background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%); border-radius: 50%;"></div>
    
    <div style="position: relative; z-index: 10; max-width: 900px; margin: 0 auto;">
      <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
        <span style="display: inline-block; background: rgba(255,255,255,0.25); backdrop-filter: blur(10px); color: white; padding: 0.5rem 1.25rem; border-radius: 2rem; font-size: 0.875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05rem;">✨ Featured Story</span>
        <span style="color: rgba(255,255,255,0.9); font-size: 0.875rem;">January 15, 2025</span>
      </div>
      <h1 style="color: white; font-size: 4rem; font-weight: 900; line-height: 1.1; margin-bottom: 1.5rem; text-shadow: 0 2px 30px rgba(0,0,0,0.3);">Breaking the Mold: Reimagining Employee Experience</h1>
      <p style="color: rgba(255,255,255,0.95); font-size: 1.5rem; line-height: 1.6; margin-bottom: 2rem; font-weight: 500;">How innovative companies are revolutionizing the way we think about work, culture, and human connection in the digital age.</p>
      <div style="display: flex; align-items: center; gap: 1.5rem; color: rgba(255,255,255,0.9);">
        <span>👥 Creative HR Team</span>
        <span>•</span>
        <span>12 min read</span>
        <span>•</span>
        <span>🔥 Trending</span>
      </div>
    </div>
  </div>
  
  <div style="max-width: 1000px; margin: -3rem auto 0; padding: 0 3rem; position: relative; z-index: 20;">
    <div style="background: white; padding: 4rem; border-radius: 1.5rem; box-shadow: 0 25px 80px rgba(0,0,0,0.12);">
      <p style="font-size: 1.375rem; line-height: 1.8; color: #334155; margin-bottom: 2rem; font-weight: 500;">The workplace revolution is here, and it's more colorful, dynamic, and human-centered than ever before. Traditional corporate structures are giving way to fluid, creative environments where innovation thrives and authenticity is celebrated.</p>
      
      <p style="font-size: 1.125rem; line-height: 1.8; color: #475569; margin-bottom: 2.5rem;">In this deep dive, we'll explore how forward-thinking organizations are dismantling outdated norms and building workplaces that inspire, energize, and empower their teams to do their best work.</p>
      
      <h2 style="background: linear-gradient(135deg, #ec4899, #f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 2.5rem; font-weight: 800; margin-top: 3rem; margin-bottom: 2rem;">The New Rules of Engagement</h2>
      
      <p style="font-size: 1.125rem; line-height: 1.8; color: #475569; margin-bottom: 2rem;">Forget everything you thought you knew about employee engagement. The game has changed, and so have the players. Today's workforce isn't motivated by ping-pong tables and free snacks (though those are nice perks). They're looking for meaning, autonomy, growth, and genuine connection.</p>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; margin: 3rem 0;">
        <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); padding: 2rem; border-radius: 1.25rem; transform: rotate(-2deg); box-shadow: 0 10px 30px rgba(245, 158, 11, 0.15);">
          <h3 style="color: #92400e; font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem;">💡 Autonomy</h3>
          <p style="color: #78350f; line-height: 1.6; margin: 0; font-size: 1rem;">Trust employees to manage their own time and workflows. Micromanagement is the enemy of creativity.</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #ddd6fe, #c4b5fd); padding: 2rem; border-radius: 1.25rem; transform: rotate(1deg); box-shadow: 0 10px 30px rgba(139, 92, 246, 0.15);">
          <h3 style="color: #5b21b6; font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem;">🚀 Purpose</h3>
          <p style="color: #6b21a8; line-height: 1.6; margin: 0; font-size: 1rem;">Connect individual roles to the bigger mission. Show how each person contributes to meaningful impact.</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #fecaca, #fca5a5); padding: 2rem; border-radius: 1.25rem; transform: rotate(-1deg); box-shadow: 0 10px 30px rgba(239, 68, 68, 0.15);">
          <h3 style="color: #991b1b; font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem;">🎯 Growth</h3>
          <p style="color: #7f1d1d; line-height: 1.6; margin: 0; font-size: 1rem;">Provide continuous opportunities for learning, challenge, and career advancement.</p>
        </div>
      </div>
      
      <h2 style="background: linear-gradient(135deg, #8b5cf6, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 2.5rem; font-weight: 800; margin-top: 4rem; margin-bottom: 2rem;">Building Spaces for Innovation</h2>
      
      <p style="font-size: 1.125rem; line-height: 1.8; color: #475569; margin-bottom: 2rem;">Physical and virtual spaces shape how we work and collaborate. The best companies are redesigning their environments—both online and offline—to spark creativity and facilitate connection.</p>
      
      <h3 style="color: #1e293b; font-size: 1.75rem; font-weight: 700; margin-top: 2.5rem; margin-bottom: 1.5rem;">Physical Workspace Design</h3>
      
      <p style="font-size: 1.125rem; line-height: 1.8; color: #475569; margin-bottom: 1.5rem;">Gone are the days of gray cubicles and fluorescent lighting. Modern workspaces incorporate natural light, biophilic design, flexible seating arrangements, and zones for different work modes—from collaborative brainstorming to deep focus.</p>
      
      <div style="background: linear-gradient(135deg, #e0e7ff, #c7d2fe); padding: 2.5rem; border-radius: 1rem; margin: 2.5rem 0; border-left: 6px solid #6366f1;">
        <h4 style="color: #3730a3; font-size: 1.25rem; font-weight: 700; margin-bottom: 1.25rem;">💭 Case Study: Tech Innovators Inc.</h4>
        <p style="color: #4338ca; font-size: 1rem; line-height: 1.7; margin-bottom: 1rem;">When this mid-sized tech company redesigned their office to include diverse work zones, collaboration pods, and relaxation areas, they saw a 45% increase in cross-team collaboration and a 30% boost in employee satisfaction scores.</p>
        <p style="color: #4338ca; font-size: 1rem; line-height: 1.7; margin: 0; font-style: italic;">"The space itself became a catalyst for the cultural transformation we were seeking." - Head of People Operations</p>
      </div>
      
      <h3 style="color: #1e293b; font-size: 1.75rem; font-weight: 700; margin-top: 2.5rem; margin-bottom: 1.5rem;">Digital Collaboration</h3>
      
      <p style="font-size: 1.125rem; line-height: 1.8; color: #475569; margin-bottom: 2rem;">Remote and hybrid teams need intentional digital infrastructure. This means choosing tools that enhance rather than hinder communication, establishing clear async communication norms, and creating virtual spaces for informal connection—the digital equivalent of water cooler conversations.</p>
      
      <h2 style="background: linear-gradient(135deg, #f59e0b, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 2.5rem; font-weight: 800; margin-top: 4rem; margin-bottom: 2rem;">The Power of Psychological Safety</h2>
      
      <p style="font-size: 1.125rem; line-height: 1.8; color: #475569; margin-bottom: 2rem;">Harvard Business School professor Amy Edmondson defines psychological safety as "a belief that one will not be punished or humiliated for speaking up with ideas, questions, concerns, or mistakes." This concept is the foundation of high-performing teams.</p>
      
      <p style="font-size: 1.125rem; line-height: 1.8; color: #475569; margin-bottom: 2rem;">When people feel safe to take risks, share unpolished ideas, admit mistakes, and challenge the status quo, magic happens. Innovation flourishes. Problems get solved faster. Teams become more resilient.</p>
      
      <div style="background: #fef3c7; padding: 2rem; border-radius: 1rem; margin: 2.5rem 0;">
        <h4 style="color: #92400e; font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem;">🌟 How to Build Psychological Safety</h4>
        <ul style="color: #78350f; font-size: 1rem; line-height: 1.8; margin: 0; padding-left: 2rem;">
          <li style="margin-bottom: 0.75rem;"><strong>Model vulnerability:</strong> Leaders should openly admit mistakes and uncertainties</li>
          <li style="margin-bottom: 0.75rem;"><strong>Frame work as learning:</strong> Emphasize that every project is an opportunity to learn</li>
          <li style="margin-bottom: 0.75rem;"><strong>Celebrate speaking up:</strong> Recognize those who voice concerns or dissenting opinions</li>
          <li style="margin-bottom: 0.75rem;"><strong>Respond productively to failures:</strong> Focus on what we can learn, not who to blame</li>
          <li><strong>Encourage questions:</strong> There should be no such thing as a "stupid question"</li>
        </ul>
      </div>
      
      <h2 style="background: linear-gradient(135deg, #ec4899, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 2.5rem; font-weight: 800; margin-top: 4rem; margin-bottom: 2rem;">Measuring What Matters</h2>
      
      <p style="font-size: 1.125rem; line-height: 1.8; color: #475569; margin-bottom: 2rem;">You can't improve what you don't measure. Progressive HR teams are moving beyond simple satisfaction surveys to gather richer, more actionable data about employee experience.</p>
      
      <ul style="font-size: 1.125rem; line-height: 2; color: #475569; margin-bottom: 2rem; padding-left: 2rem;">
        <li style="margin-bottom: 1rem;"><strong>Pulse surveys:</strong> Regular, short check-ins that track sentiment over time</li>
        <li style="margin-bottom: 1rem;"><strong>Stay interviews:</strong> Don't wait for exit interviews—talk to current employees about why they stay</li>
        <li style="margin-bottom: 1rem;"><strong>Network analysis:</strong> Understand informal communication patterns and identify isolated team members</li>
        <li style="margin-bottom: 1rem;"><strong>Qualitative feedback:</strong> Conduct regular focus groups and one-on-ones to hear stories behind the numbers</li>
      </ul>
      
      <h2 style="background: linear-gradient(135deg, #f59e0b, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 2.5rem; font-weight: 800; margin-top: 4rem; margin-bottom: 2rem;">The Future Is Human</h2>
      
      <p style="font-size: 1.125rem; line-height: 1.8; color: #475569; margin-bottom: 2rem;">As we look ahead, one thing becomes clear: despite all the talk of automation and AI, the most successful companies will be those that put humanity at the center of everything they do.</p>
      
      <p style="font-size: 1.125rem; line-height: 1.8; color: #475569; margin-bottom: 3rem;">Technology should enhance our ability to connect, create, and contribute—not replace it. The organizations that understand this, that design experiences with empathy and intention, will attract the best talent, generate the best ideas, and build cultures that stand the test of time.</p>
      
      <div style="background: linear-gradient(135deg, #ec4899, #f59e0b, #8b5cf6); padding: 3rem; border-radius: 1.25rem; color: white; text-align: center; margin-top: 4rem;">
        <h3 style="font-size: 2rem; font-weight: 800; margin-bottom: 1rem; text-shadow: 0 2px 10px rgba(0,0,0,0.2);">Join the Revolution</h3>
        <p style="font-size: 1.125rem; line-height: 1.7; margin-bottom: 2rem; opacity: 0.95;">Ready to transform your workplace culture? Let's create something extraordinary together.</p>
        <a href="#" style="display: inline-block; background: white; color: #ec4899; padding: 1rem 2.5rem; border-radius: 2rem; font-weight: 700; text-decoration: none; box-shadow: 0 10px 30px rgba(0,0,0,0.2); font-size: 1.125rem;">Start Your Journey</a>
      </div>
    </div>
  </div>
</div>
    `,
  },
  {
    id: "minimalist-elegant",
    name: "Minimalist Elegant",
    description: "Clean, sophisticated design focused on typography and whitespace",
    category: "minimal",
    preview: "⚪",
    html: `
<div style="max-width: 750px; margin: 0 auto; font-family: 'Georgia', serif; color: #18181b; padding: 5rem 3rem;">
  <div style="text-align: center; margin-bottom: 5rem;">
    <p style="color: #71717a; text-transform: uppercase; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.2rem; margin-bottom: 2rem; font-family: 'Inter', sans-serif;">THOUGHT LEADERSHIP</p>
    <h1 style="font-size: 3.5rem; font-weight: 400; line-height: 1.2; margin-bottom: 2rem; letter-spacing: -0.02em;">The Art of Leading with Purpose</h1>
    <p style="color: #52525b; font-size: 1.375rem; line-height: 1.6; font-style: italic; margin-bottom: 3rem;">A meditation on authentic leadership and the profound impact of human-centered management in modern organizations</p>
    <div style="display: flex; justify-content: center; align-items: center; gap: 1.5rem; color: #71717a; font-size: 0.875rem; font-family: 'Inter', sans-serif; margin-bottom: 2rem;">
      <span>By Dr. Maria Chen</span>
      <span>•</span>
      <span>January 2025</span>
      <span>•</span>
      <span>15 min read</span>
    </div>
    <div style="width: 80px; height: 2px; background: #18181b; margin: 0 auto;"></div>
  </div>
  
  <div style="font-size: 1.25rem; line-height: 2; color: #3f3f46;">
    <p style="margin-bottom: 2rem; text-indent: 3em;">In an era dominated by metrics, quarterly reports, and efficiency optimization, we risk losing sight of what truly makes organizations thrive: the human element. Leadership is not merely a function of position or authority—it is an art form that requires presence, empathy, and unwavering commitment to growth.</p>
    
    <p style="margin-bottom: 2rem;">This essay explores the subtle yet profound ways that purposeful leadership shapes organizational culture and individual lives. Through thoughtful examination of what it means to lead authentically, we uncover timeless principles that remain relevant regardless of industry or context.</p>
    
    <h2 style="font-size: 2.25rem; font-weight: 400; margin-top: 5rem; margin-bottom: 2rem; letter-spacing: -0.01em;">On the Nature of Authentic Leadership</h2>
    
    <p style="margin-bottom: 2rem;">True leadership begins with self-awareness. Before we can effectively guide others, we must understand our own values, biases, strengths, and limitations. This journey inward is not comfortable—it requires honest reflection and the courage to confront aspects of ourselves we might prefer to ignore.</p>
    
    <p style="margin-bottom: 2rem;">Yet this uncomfortable work is essential. Leaders who lack self-awareness often project their unexamined issues onto their teams, creating dysfunction that ripples throughout the organization. Conversely, those who invest in understanding themselves become more perceptive, more compassionate, and more effective in their roles.</p>
    
    <blockquote style="border-left: 3px solid #18181b; padding-left: 2.5rem; margin: 4rem 0; font-style: italic; color: #52525b; font-size: 1.5rem; line-height: 1.8;">
      "The curious paradox is that when I accept myself just as I am, then I can change."
      <span style="font-size: 1.125rem; font-style: normal; color: #71717a; margin-top: 1rem; display: block; font-family: 'Inter', sans-serif;">— Carl Rogers, Psychologist</span>
    </blockquote>
    
    <h2 style="font-size: 2.25rem; font-weight: 400; margin-top: 5rem; margin-bottom: 2rem; letter-spacing: -0.01em;">The Power of Presence</h2>
    
    <p style="margin-bottom: 2rem;">In our hyper-connected world, true presence has become increasingly rare and increasingly valuable. When leaders are genuinely present—not distracted by devices, not mentally rehearsing their next statement, but fully engaged with the person before them—something remarkable happens.</p>
    
    <p style="margin-bottom: 2rem;">Employees feel seen. They feel heard. This simple act of presence communicates respect and value more eloquently than any company mission statement ever could. It creates psychological safety, the foundation upon which all meaningful collaboration is built.</p>
    
    <p style="margin-bottom: 2rem;">Consider the difference between these two scenarios: In the first, a manager conducts a one-on-one meeting while simultaneously checking email, glancing at the clock, and mentally running through their to-do list. In the second, the manager sets aside distractions, maintains eye contact, asks thoughtful questions, and listens with genuine curiosity.</p>
    
    <p style="margin-bottom: 2rem;">The investment of time is identical. The impact is worlds apart.</p>
    
    <div style="background: #fafafa; border: 1px solid #e4e4e7; padding: 3rem; margin: 4rem 0; font-family: 'Inter', sans-serif;">
      <p style="font-size: 1rem; font-weight: 600; color: #18181b; margin-bottom: 1.5rem; text-transform: uppercase; letter-spacing: 0.05em;">Practical Wisdom</p>
      <p style="font-size: 1.125rem; line-height: 1.8; color: #52525b; margin: 0;">Practice the art of presence by establishing "sacred spaces" in your schedule—blocks of time when you are fully available without digital distraction. Start with just 30 minutes daily. The quality of your interactions will transform.</p>
    </div>
    
    <h2 style="font-size: 2.25rem; font-weight: 400; margin-top: 5rem; margin-bottom: 2rem; letter-spacing: -0.01em;">Creating Conditions for Flourishing</h2>
    
    <p style="margin-bottom: 2rem;">A gardener does not make plants grow. The gardener creates conditions in which growth naturally occurs: proper soil, adequate water, sufficient sunlight. Leadership functions similarly. Our role is not to control outcomes but to cultivate environments where people can flourish.</p>
    
    <p style="margin-bottom: 2rem;">This requires deep understanding of what people need to do their best work. Some thrive with clear structure and guidance. Others need autonomy and space to experiment. The skillful leader adapts their approach to serve the individual, rather than expecting everyone to adapt to a single management style.</p>
    
    <h3 style="font-size: 1.75rem; font-weight: 400; margin-top: 3rem; margin-bottom: 1.5rem; letter-spacing: -0.01em; font-style: italic;">Essential Nutrients for Growth</h3>
    
    <p style="margin-bottom: 1.5rem;">What are the fundamental conditions that enable people to thrive? Research and experience point to several core elements:</p>
    
    <p style="margin-bottom: 1rem;"><em>Clarity of purpose.</em> People need to understand not just what they're doing, but why it matters. How does their work contribute to the larger mission? Who benefits from their efforts? Purpose provides motivation that survives setbacks and challenges.</p>
    
    <p style="margin-bottom: 1rem;"><em>Room for mastery.</em> The opportunity to develop skills, take on new challenges, and become excellent at something deeply satisfying to the human spirit. Create pathways for growth, provide resources for learning, and celebrate progress.</p>
    
    <p style="margin-bottom: 1rem;"><em>Genuine connection.</em> We are social creatures who thrive in community. Foster relationships among team members. Create spaces—both physical and temporal—for informal interaction. Strong workplace relationships buffer against stress and enhance resilience.</p>
    
    <p style="margin-bottom: 2rem;"><em>Freedom to contribute.</em> People possess insights and capabilities that go far beyond their job descriptions. Invite their perspectives. Encourage initiative. Trust them to make meaningful decisions about their work.</p>
    
    <h2 style="font-size: 2.25rem; font-weight: 400; margin-top: 5rem; margin-bottom: 2rem; letter-spacing: -0.01em;">The Long View</h2>
    
    <p style="margin-bottom: 2rem;">Our contemporary business culture often prioritizes short-term results over long-term sustainability. Yet the most enduring organizations are those that resist this pressure, choosing instead to invest in their people with patience and consistency.</p>
    
    <p style="margin-bottom: 2rem;">This means accepting that culture change takes time. It means measuring success not just in quarterly earnings but in retention rates, employee wellbeing, and the quality of relationships within the organization. It means recognizing that some of the most important outcomes cannot be easily quantified.</p>
    
    <p style="margin-bottom: 2rem;">Leaders who embrace this long view operate with a different kind of confidence. They are less reactive to momentary setbacks, more committed to foundational principles, and more capable of guiding their organizations through inevitable periods of uncertainty.</p>
    
    <div style="text-align: center; margin: 5rem 0;">
      <div style="width: 100px; height: 2px; background: #18181b; margin: 0 auto 3rem;"></div>
      <p style="font-size: 1.125rem; line-height: 1.8; color: #52525b; font-style: italic; max-width: 600px; margin: 0 auto;">In the end, leadership is measured not by what we accomplish for ourselves, but by what we enable others to achieve—and by the quality of the environments we create for human potential to unfold.</p>
    </div>
    
    <h2 style="font-size: 2.25rem; font-weight: 400; margin-top: 5rem; margin-bottom: 2rem; letter-spacing: -0.01em;">Conclusion: An Ongoing Practice</h2>
    
    <p style="margin-bottom: 2rem;">Leadership with purpose is not a destination but a practice—one that requires daily attention, periodic reflection, and continuous refinement. We will make mistakes. We will fall short of our ideals. This is not failure; it is the nature of growth.</p>
    
    <p style="margin-bottom: 3rem;">What matters is our commitment to learning, our willingness to be vulnerable, and our dedication to serving those we lead. When we approach leadership as a sacred trust—an opportunity to positively shape lives and build something meaningful—we tap into wellsprings of creativity, resilience, and purpose that benefit everyone.</p>
    
    <div style="border-top: 1px solid #e4e4e7; border-bottom: 1px solid #e4e4e7; padding: 3rem 0; margin: 5rem 0; font-family: 'Inter', sans-serif;">
      <p style="font-size: 0.875rem; font-weight: 600; color: #71717a; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.1em;">About the Author</p>
      <p style="font-size: 1rem; line-height: 1.8; color: #52525b; margin: 0;">Dr. Maria Chen is an organizational psychologist, executive coach, and author of "The Human Organization." She has spent two decades helping leaders create more conscious, compassionate workplaces.</p>
    </div>
  </div>
</div>
    `,
  },
  {
    id: "vibrant-event",
    name: "Vibrant Event",
    description: "Energetic, colorful design for event announcements and HR celebrations",
    category: "vibrant",
    preview: "🎉",
    html: `
<div style="font-family: 'Inter', sans-serif; background: linear-gradient(180deg, #fef3c7 0%, #fde68a 30%, #fbbf24 100%); padding: 4rem 2rem;">
  <div style="max-width: 1100px; margin: 0 auto;">
    <div style="text-align: center; margin-bottom: 4rem;">
      <span style="display: inline-block; background: white; color: #f59e0b; padding: 0.75rem 2rem; border-radius: 3rem; font-size: 1.125rem; font-weight: 800; margin-bottom: 2rem; box-shadow: 0 8px 20px rgba(245, 158, 11, 0.35); text-transform: uppercase; letter-spacing: 0.05em;">🎊 Special Announcement 🎊</span>
      <h1 style="color: #78350f; font-size: 4rem; font-weight: 900; line-height: 1.1; margin-bottom: 1.5rem; text-transform: uppercase; letter-spacing: -0.02em; text-shadow: 2px 2px 0 rgba(245, 158, 11, 0.3);">Annual HR Excellence Summit 2025</h1>
      <p style="color: #92400e; font-size: 1.75rem; font-weight: 700; line-height: 1.4; margin-bottom: 2rem;">Join 500+ HR Professionals for Two Days of Learning, Networking, and Celebration!</p>
      <div style="display: inline-flex; align-items: center; gap: 2rem; background: rgba(255,255,255,0.7); padding: 1rem 2.5rem; border-radius: 1rem; font-size: 1.125rem; font-weight: 600; color: #92400e;">
        <span>📅 March 15-16, 2025</span>
        <span>•</span>
        <span>📍 Grand Convention Center</span>
        <span>•</span>
        <span>🎟️ Register Now</span>
      </div>
    </div>
    
    <div style="background: white; padding: 4rem; border-radius: 2rem; box-shadow: 0 20px 60px rgba(0,0,0,0.15); margin-bottom: 3rem;">
      <div style="text-align: center; margin-bottom: 3rem;">
        <h2 style="color: #78350f; font-size: 2.5rem; font-weight: 900; margin-bottom: 1.5rem;">Why You Can't Miss This Event</h2>
        <p style="font-size: 1.25rem; line-height: 1.8; color: #334155; max-width: 800px; margin: 0 auto;">The HR Excellence Summit brings together the brightest minds in human resources for an unforgettable experience of learning, innovation, and community. This year's agenda is our most ambitious yet!</p>
      </div>
      
      <div style="background: linear-gradient(135deg, #fed7aa, #fdba74); padding: 3rem; border-radius: 1.5rem; margin: 3rem 0;">
        <h2 style="color: #7c2d12; font-size: 2rem; font-weight: 900; margin-bottom: 2rem; text-align: center;">📅 What to Expect</h2>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-top: 2.5rem;">
          <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
            <div style="font-size: 3rem; margin-bottom: 1rem;">🎤</div>
            <h3 style="color: #7c2d12; font-size: 1.5rem; font-weight: 800; margin-bottom: 1rem;">Keynote Speakers</h3>
            <p style="color: #9a3412; font-size: 1rem; line-height: 1.6; margin: 0;">Industry leaders sharing insights on the future of work, AI in HR, and building resilient cultures</p>
          </div>
          
          <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
            <div style="font-size: 3rem; margin-bottom: 1rem;">💼</div>
            <h3 style="color: #7c2d12; font-size: 1.5rem; font-weight: 800; margin-bottom: 1rem;">Workshops</h3>
            <p style="color: #9a3412; font-size: 1rem; line-height: 1.6; margin: 0;">Hands-on sessions covering talent acquisition, employee engagement, compensation strategies, and more</p>
          </div>
          
          <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
            <div style="font-size: 3rem; margin-bottom: 1rem;">🤝</div>
            <h3 style="color: #7c2d12; font-size: 1.5rem; font-weight: 800; margin-bottom: 1rem;">Networking</h3>
            <p style="color: #9a3412; font-size: 1rem; line-height: 1.6; margin: 0;">Connect with peers, exchange ideas, and build relationships that extend beyond the event</p>
          </div>
        </div>
        
        <ul style="list-style: none; padding: 0; margin: 3rem 0 0 0;">
          <li style="color: #7c2d12; font-size: 1.125rem; font-weight: 600; margin-bottom: 1.25rem; padding-left: 3rem; position: relative; line-height: 1.6;">
            <span style="position: absolute; left: 0; top: 0; font-size: 1.5rem;">✨</span> 
            <strong>30+ Expert-Led Sessions</strong> covering everything from DEI initiatives to HR analytics
          </li>
          <li style="color: #7c2d12; font-size: 1.125rem; font-weight: 600; margin-bottom: 1.25rem; padding-left: 3rem; position: relative; line-height: 1.6;">
            <span style="position: absolute; left: 0; top: 0; font-size: 1.5rem;">🎯</span> 
            <strong>Innovation Showcase</strong> featuring the latest HR tech solutions and platforms
          </li>
          <li style="color: #7c2d12; font-size: 1.125rem; font-weight: 600; margin-bottom: 1.25rem; padding-left: 3rem; position: relative; line-height: 1.6;">
            <span style="position: absolute; left: 0; top: 0; font-size: 1.5rem;">🏆</span> 
            <strong>Excellence Awards Ceremony</strong> recognizing outstanding HR achievements
          </li>
          <li style="color: #7c2d12; font-size: 1.125rem; font-weight: 600; margin-bottom: 1.25rem; padding-left: 3rem; position: relative; line-height: 1.6;">
            <span style="position: absolute; left: 0; top: 0; font-size: 1.5rem;">🎭</span> 
            <strong>Evening Gala</strong> with entertainment, dining, and celebration
          </li>
          <li style="color: #7c2d12; font-size: 1.125rem; font-weight: 600; padding-left: 3rem; position: relative; line-height: 1.6;">
            <span style="position: absolute; left: 0; top: 0; font-size: 1.5rem;">📚</span> 
            <strong>Digital Resource Library</strong> with templates, guides, and tools to take home
          </li>
        </ul>
      </div>
      
      <h2 style="color: #78350f; font-size: 2.5rem; font-weight: 900; margin-top: 4rem; margin-bottom: 2rem; text-align: center;">🌟 Featured Keynote Speakers</h2>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; margin: 2.5rem 0;">
        <div style="text-align: center; padding: 2rem; background: linear-gradient(135deg, #fef3c7, #fde68a); border-radius: 1rem;">
          <div style="width: 120px; height: 120px; border-radius: 50%; background: linear-gradient(135deg, #f59e0b, #d97706); margin: 0 auto 1.5rem; display: flex; align-items: center; justify-content: center; font-size: 3rem; box-shadow: 0 10px 30px rgba(245, 158, 11, 0.3);">👩‍💼</div>
          <h3 style="color: #78350f; font-size: 1.375rem; font-weight: 800; margin-bottom: 0.5rem;">Sarah Martinez</h3>
          <p style="color: #92400e; font-size: 0.875rem; font-weight: 600; margin-bottom: 1rem;">Chief People Officer, TechGiant Inc.</p>
          <p style="color: #9a3412; font-size: 1rem; line-height: 1.6; margin: 0;">"Building Cultures That Scale: Lessons from Hypergrowth"</p>
        </div>
        
        <div style="text-align: center; padding: 2rem; background: linear-gradient(135deg, #fef3c7, #fde68a); border-radius: 1rem;">
          <div style="width: 120px; height: 120px; border-radius: 50%; background: linear-gradient(135deg, #f59e0b, #d97706); margin: 0 auto 1.5rem; display: flex; align-items: center; justify-content: center; font-size: 3rem; box-shadow: 0 10px 30px rgba(245, 158, 11, 0.3);">👨‍🏫</div>
          <h3 style="color: #78350f; font-size: 1.375rem; font-weight: 800; margin-bottom: 0.5rem;">Dr. James Wong</h3>
          <p style="color: #92400e; font-size: 0.875rem; font-weight: 600; margin-bottom: 1rem;">Organizational Psychologist & Author</p>
          <p style="color: #9a3412; font-size: 1rem; line-height: 1.6; margin: 0;">"The Science of Employee Wellbeing and Performance"</p>
        </div>
        
        <div style="text-align: center; padding: 2rem; background: linear-gradient(135deg, #fef3c7, #fde68a); border-radius: 1rem;">
          <div style="width: 120px; height: 120px; border-radius: 50%; background: linear-gradient(135deg, #f59e0b, #d97706); margin: 0 auto 1.5rem; display: flex; align-items: center; justify-content: center; font-size: 3rem; box-shadow: 0 10px 30px rgba(245, 158, 11, 0.3);">👩‍💻</div>
          <h3 style="color: #78350f; font-size: 1.375rem; font-weight: 800; margin-bottom: 0.5rem;">Aisha Patel</h3>
          <p style="color: #92400e; font-size: 0.875rem; font-weight: 600; margin-bottom: 1rem;">CEO, FutureWork Solutions</p>
          <p style="color: #9a3412; font-size: 1rem; line-height: 1.6; margin: 0;">"AI and the Future of Human Resources"</p>
        </div>
      </div>
      
      <div style="background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 3rem; border-radius: 1.5rem; margin: 4rem 0; text-align: center;">
        <h3 style="font-size: 2rem; font-weight: 900; margin-bottom: 1rem; text-shadow: 0 2px 10px rgba(0,0,0,0.2);">⚡ Early Bird Special</h3>
        <p style="font-size: 1.375rem; line-height: 1.6; margin-bottom: 2rem; opacity: 0.95;">Register before February 1st and save 30%!</p>
        <div style="background: white; color: #dc2626; display: inline-block; padding: 0.5rem 2rem; border-radius: 0.5rem; font-weight: 900; font-size: 2rem; margin-bottom: 1.5rem; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">$399 <span style="font-size: 1.25rem; text-decoration: line-through; opacity: 0.5; margin-left: 1rem;">$570</span></div>
        <p style="font-size: 1rem; margin-bottom: 2rem; opacity: 0.9;">All-access pass includes meals, materials, and networking events</p>
        <a href="#" style="display: inline-block; background: white; color: #dc2626; padding: 1.25rem 3rem; border-radius: 3rem; font-weight: 800; text-decoration: none; font-size: 1.25rem; box-shadow: 0 10px 30px rgba(0,0,0,0.3); text-transform: uppercase; letter-spacing: 0.05em;">Secure Your Spot Now</a>
      </div>
      
      <h2 style="color: #78350f; font-size: 2.5rem; font-weight: 900; margin-top: 4rem; margin-bottom: 2rem; text-align: center;">💬 What Past Attendees Say</h2>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin: 2.5rem 0;">
        <div style="background: #fef3c7; padding: 2rem; border-radius: 1rem; border-left: 4px solid #f59e0b;">
          <p style="color: #78350f; font-size: 1rem; line-height: 1.7; margin-bottom: 1.5rem; font-style: italic;">"This summit completely transformed how I think about employee engagement. The networking alone was worth the price of admission!"</p>
          <p style="color: #92400e; font-weight: 700; margin: 0;">— Jennifer L., HR Director</p>
        </div>
        
        <div style="background: #fef3c7; padding: 2rem; border-radius: 1rem; border-left: 4px solid #f59e0b;">
          <p style="color: #78350f; font-size: 1rem; line-height: 1.7; margin-bottom: 1.5rem; font-style: italic;">"Practical, actionable insights I could implement immediately. Best professional development investment I've made in years."</p>
          <p style="color: #92400e; font-weight: 700; margin: 0;">— Marcus T., Talent Acquisition Lead</p>
        </div>
        
        <div style="background: #fef3c7; padding: 2rem; border-radius: 1rem; border-left: 4px solid #f59e0b;">
          <p style="color: #78350f; font-size: 1rem; line-height: 1.7; margin-bottom: 1.5rem; font-style: italic;">"The energy was incredible! I left feeling inspired, connected, and equipped with new strategies to elevate our HR function."</p>
          <p style="color: #92400e; font-weight: 700; margin: 0;">— Priya S., People Operations Manager</p>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 4rem; padding: 3rem; background: linear-gradient(135deg, #fef3c7, #fde68a); border-radius: 1.5rem;">
        <h3 style="color: #78350f; font-size: 2rem; font-weight: 900; margin-bottom: 1.5rem;">Questions? We're Here to Help!</h3>
        <p style="color: #92400e; font-size: 1.125rem; line-height: 1.6; margin-bottom: 2rem;">Contact our event team for group rates, sponsorship opportunities, or general inquiries.</p>
        <div style="display: flex; justify-content: center; gap: 2rem; flex-wrap: wrap;">
          <a href="mailto:summit@hrmarket.com" style="color: #78350f; font-weight: 700; text-decoration: none; font-size: 1.125rem;">📧 summit@hrmarket.com</a>
          <span style="color: #92400e;">•</span>
          <a href="tel:+1234567890" style="color: #78350f; font-weight: 700; text-decoration: none; font-size: 1.125rem;">📞 (123) 456-7890</a>
        </div>
      </div>
    </div>
  </div>
</div>
    `,
  },
  {
    id: "tech-modern",
    name: "Tech Modern",
    description: "Sleek, futuristic design for HR tech and digital transformation topics",
    category: "tech",
    preview: "💻",
    html: `
<div style="background: #0f172a; color: white; font-family: 'Inter', sans-serif; padding: 4rem 2rem;">
  <div style="max-width: 1100px; margin: 0 auto;">
    <div style="background: linear-gradient(135deg, #1e293b, #334155); padding: 4rem 3rem; border-radius: 1.5rem; border: 1px solid #334155; margin-bottom: 4rem; position: relative; overflow: hidden;">
      <div style="position: absolute; top: -20%; right: -10%; width: 500px; height: 500px; background: radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, transparent 70%); border-radius: 50%;"></div>
      <div style="position: absolute; bottom: -30%; left: -15%; width: 600px; height: 600px; background: radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%); border-radius: 50%;"></div>
      
      <div style="position: relative; z-index: 10;">
        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap;">
          <span style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 0.5rem 1.5rem; border-radius: 0.5rem; font-size: 0.875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">🚀 Future of Work</span>
          <span style="color: #94a3b8; font-size: 0.875rem;">•</span>
          <span style="color: #94a3b8; font-size: 0.875rem;">January 15, 2025</span>
          <span style="color: #94a3b8; font-size: 0.875rem;">•</span>
          <span style="color: #94a3b8; font-size: 0.875rem;">15 min read</span>
        </div>
        <h1 style="font-size: 4rem; font-weight: 900; line-height: 1.1; margin-bottom: 1.5rem; background: linear-gradient(135deg, #ffffff, #93c5fd); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; letter-spacing: -0.02em;">Artificial Intelligence in HR: Beyond the Hype</h1>
        <p style="color: #cbd5e1; font-size: 1.5rem; line-height: 1.6; margin-bottom: 2rem; font-weight: 500;">Exploring the real-world applications, ethical considerations, and transformative potential of AI technologies in human resource management.</p>
        <div style="display: flex; align-items: center; gap: 2rem; color: #94a3b8; font-size: 0.875rem;">
          <span>By Alex Rivera, Chief Technology Officer</span>
          <span>•</span>
          <span>HR Technology</span>
        </div>
      </div>
    </div>
    
    <div style="background: #1e293b; padding: 4rem 3rem; border-radius: 1.25rem; border: 1px solid #334155;">
      <p style="font-size: 1.375rem; line-height: 1.8; color: #cbd5e1; margin-bottom: 2rem; font-weight: 500;">Artificial Intelligence is no longer a distant future concept—it's here, it's powerful, and it's fundamentally changing how we approach human resources. But amid the buzzwords and vendor promises, what does AI actually mean for HR professionals today?</p>
      
      <p style="font-size: 1.125rem; line-height: 1.8; color: #cbd5e1; margin-bottom: 3rem;">This comprehensive guide cuts through the noise to examine practical AI applications, share real implementation insights, and address the critical questions every HR leader should be asking about this transformative technology.</p>
      
      <h2 style="color: #60a5fa; font-size: 2.5rem; font-weight: 900; margin-top: 4rem; margin-bottom: 2rem; font-family: 'SF Mono', 'Monaco', monospace; letter-spacing: -0.02em;">&lt;The Current State /&gt;</h2>
      
      <p style="font-size: 1.125rem; line-height: 1.8; color: #cbd5e1; margin-bottom: 2rem;">AI has evolved from a novelty to an essential tool in the HR technology stack. According to recent research, 76% of HR leaders believe that if their organization doesn't adopt AI solutions in the next 12-24 months, they'll be lagging behind in organizational success.</p>
      
      <p style="font-size: 1.125rem; line-height: 1.8; color: #cbd5e1; margin-bottom: 3rem;">But this rapid adoption comes with challenges. The gap between AI's potential and its practical implementation remains significant. Many organizations have invested in AI tools without clear strategies for integration or measurement of impact.</p>
      
      <div style="background: linear-gradient(135deg, #1e3a8a, #3b82f6); padding: 2.5rem; border-radius: 1rem; margin: 3rem 0; border: 1px solid #3b82f6; position: relative; overflow: hidden;">
        <div style="position: absolute; top: 0; right: 0; font-size: 8rem; opacity: 0.1; line-height: 1;">💡</div>
        <p style="font-size: 1.125rem; line-height: 1.7; color: #dbeafe; margin: 0; font-family: 'SF Mono', 'Monaco', monospace; position: relative; z-index: 10;"><strong style="color: #93c5fd;">→ Key Insight:</strong> The most successful AI implementations focus not on replacing human judgment, but on augmenting it—freeing HR professionals from administrative tasks to focus on strategic work that requires empathy, creativity, and complex decision-making.</p>
      </div>
      
      <h2 style="color: #60a5fa; font-size: 2.5rem; font-weight: 900; margin-top: 4rem; margin-bottom: 2rem; font-family: 'SF Mono', 'Monaco', monospace; letter-spacing: -0.02em;">&lt;Practical Applications /&gt;</h2>
      
      <h3 style="color: #94a3b8; font-size: 1.75rem; font-weight: 700; margin-top: 3rem; margin-bottom: 1.5rem;">1. Intelligent Talent Acquisition</h3>
      
      <p style="font-size: 1.125rem; line-height: 1.8; color: #cbd5e1; margin-bottom: 2rem;">AI-powered recruitment tools can screen thousands of resumes in seconds, identifying candidates whose skills and experience match job requirements. But the real value goes deeper:</p>
      
      <ul style="font-size: 1.125rem; line-height: 1.8; color: #cbd5e1; margin-bottom: 2rem; padding-left: 2rem;">
        <li style="margin-bottom: 1rem;"><strong style="color: #93c5fd;">Bias Reduction:</strong> When properly designed, AI can help identify and mitigate unconscious bias in hiring decisions</li>
        <li style="margin-bottom: 1rem;"><strong style="color: #93c5fd;">Predictive Analytics:</strong> Machine learning models can predict candidate success based on historical data</li>
        <li style="margin-bottom: 1rem;"><strong style="color: #93c5fd;">Candidate Experience:</strong> Chatbots provide 24/7 responses to applicant questions, dramatically improving communication</li>
        <li style="margin-bottom: 1rem;"><strong style="color: #93c5fd;">Passive Sourcing:</strong> AI tools can identify potential candidates across platforms who aren't actively job hunting</li>
      </ul>
      
      <div style="background: #0f172a; padding: 2rem; border-radius: 0.75rem; margin: 2.5rem 0; border: 1px solid #334155;">
        <h4 style="color: #60a5fa; font-size: 1.125rem; font-weight: 700; margin-bottom: 1rem; font-family: 'SF Mono', 'Monaco', monospace;">// Real-World Example</h4>
        <p style="color: #94a3b8; font-size: 1rem; line-height: 1.7; margin: 0;">TechCorp implemented an AI screening system that reduced time-to-hire by 40% while simultaneously increasing diversity in their candidate pool by 25%. The key was training the model on diverse, successful employee data rather than relying on traditional proxies for "fit."</p>
      </div>
      
      <h3 style="color: #94a3b8; font-size: 1.75rem; font-weight: 700; margin-top: 3rem; margin-bottom: 1.5rem;">2. Personalized Learning & Development</h3>
      
      <p style="font-size: 1.125rem; line-height: 1.8; color: #cbd5e1; margin-bottom: 2rem;">AI-driven learning platforms can analyze individual employee skills, career goals, and learning styles to create customized development paths. This moves beyond one-size-fits-all training to truly personalized growth experiences.</p>
      
      <p style="font-size: 1.125rem; line-height: 1.8; color: #cbd5e1; margin-bottom: 2rem;">These systems can recommend specific courses, articles, mentors, and projects based on an employee's current role, career aspirations, and skill gaps. They adapt in real-time as the employee progresses, ensuring continuous relevance.</p>
      
      <h3 style="color: #94a3b8; font-size: 1.75rem; font-weight: 700; margin-top: 3rem; margin-bottom: 1.5rem;">3. Predictive Retention Analysis</h3>
      
      <p style="font-size: 1.125rem; line-height: 1.8; color: #cbd5e1; margin-bottom: 2rem;">Perhaps one of AI's most powerful applications in HR is its ability to identify flight risk before employees start actively job hunting. By analyzing patterns in communication, performance, engagement surveys, and other data points, AI can flag employees who may be considering leaving.</p>
      
      <p style="font-size: 1.125rem; line-height: 1.8; color: #cbd5e1; margin-bottom: 2rem;">This early warning system gives HR teams the opportunity to have proactive conversations and address concerns before they result in resignation.</p>
      
      <h3 style="color: #94a3b8; font-size: 1.75rem; font-weight: 700; margin-top: 3rem; margin-bottom: 1.5rem;">4. Enhanced Employee Support</h3>
      
      <p style="font-size: 1.125rem; line-height: 1.8; color: #cbd5e1; margin-bottom: 2.5rem;">AI-powered virtual assistants can handle routine HR queries 24/7, from "How much PTO do I have?" to "What's our parental leave policy?" This frees HR professionals to focus on complex, high-touch interactions while ensuring employees get immediate answers to common questions.</p>
      
      <div style="background: linear-gradient(135deg, #581c87, #7c3aed); padding: 3rem; border-radius: 1rem; margin: 4rem 0; border: 1px solid #7c3aed;">
        <h3 style="font-size: 2rem; font-weight: 900; margin-bottom: 2rem; color: white; text-align: center;">📊 The Impact: By the Numbers</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 2.5rem;">
          <div style="text-align: center;">
            <p style="color: #c4b5fd; font-size: 3.5rem; font-weight: 900; margin-bottom: 0.5rem; font-family: 'SF Mono', 'Monaco', monospace;">67%</p>
            <p style="color: #e9d5ff; font-size: 0.875rem; line-height: 1.5; margin: 0;">reduction in time spent on administrative HR tasks</p>
          </div>
          <div style="text-align: center;">
            <p style="color: #c4b5fd; font-size: 3.5rem; font-weight: 900; margin-bottom: 0.5rem; font-family: 'SF Mono', 'Monaco', monospace;">2.5x</p>
            <p style="color: #e9d5ff; font-size: 0.875rem; line-height: 1.5; margin: 0;">faster candidate screening with maintained or improved quality</p>
          </div>
          <div style="text-align: center;">
            <p style="color: #c4b5fd; font-size: 3.5rem; font-weight: 900; margin-bottom: 0.5rem; font-family: 'SF Mono', 'Monaco', monospace;">85%</p>
            <p style="color: #e9d5ff; font-size: 0.875rem; line-height: 1.5; margin: 0;">of employee questions resolved by AI assistants without human intervention</p>
          </div>
          <div style="text-align: center;">
            <p style="color: #c4b5fd; font-size: 3.5rem; font-weight: 900; margin-bottom: 0.5rem; font-family: 'SF Mono', 'Monaco', monospace;">40%</p>
            <p style="color: #e9d5ff; font-size: 0.875rem; line-height: 1.5; margin: 0;">improvement in learning engagement with personalized AI recommendations</p>
          </div>
        </div>
      </div>
      
      <h2 style="color: #60a5fa; font-size: 2.5rem; font-weight: 900; margin-top: 4rem; margin-bottom: 2rem; font-family: 'SF Mono', 'Monaco', monospace; letter-spacing: -0.02em;">&lt;Ethical Considerations /&gt;</h2>
      
      <p style="font-size: 1.125rem; line-height: 1.8; color: #cbd5e1; margin-bottom: 2rem;">With great power comes great responsibility. As HR leaders implement AI solutions, several critical ethical questions demand attention:</p>
      
      <div style="background: #0f172a; padding: 2.5rem; border-radius: 1rem; margin: 2.5rem 0; border-left: 4px solid #ef4444;">
        <h4 style="color: #f87171; font-size: 1.375rem; font-weight: 700; margin-bottom: 1.5rem;">⚠️ Bias Amplification</h4>
        <p style="color: #cbd5e1; font-size: 1rem; line-height: 1.7; margin-bottom: 1rem;">AI systems learn from historical data. If that data reflects past biases, the AI will perpetuate and potentially amplify them. Organizations must audit their data, test for bias, and continuously monitor AI decisions for fairness.</p>
        <p style="color: #94a3b8; font-size: 0.875rem; line-height: 1.6; margin: 0; font-style: italic;">Example: An AI recruitment tool trained on resumes from a predominantly male industry may systematically downgrade female candidates.</p>
      </div>
      
      <div style="background: #0f172a; padding: 2.5rem; border-radius: 1rem; margin: 2.5rem 0; border-left: 4px solid #f59e0b;">
        <h4 style="color: #fbbf24; font-size: 1.375rem; font-weight: 700; margin-bottom: 1.5rem;">🔒 Privacy & Data Security</h4>
        <p style="color: #cbd5e1; font-size: 1rem; line-height: 1.7; margin: 0;">AI systems require data—often sensitive employee information. Organizations must implement robust data governance, ensure compliance with privacy regulations, and be transparent with employees about what data is collected and how it's used.</p>
      </div>
      
      <div style="background: #0f172a; padding: 2.5rem; border-radius: 1rem; margin: 2.5rem 0; border-left: 4px solid #8b5cf6;">
        <h4 style="color: #a7bfa; font-size: 1.375rem; font-weight: 700; margin-bottom: 1.5rem;">🎯 Transparency & Explainability</h4>
        <p style="color: #cbd5e1; font-size: 1rem; line-height: 1.7; margin: 0;">Employees have a right to understand how AI-powered decisions affecting their careers are made. "Black box" systems that can't explain their reasoning are problematic, particularly for high-stakes decisions like promotions or terminations.</p>
      </div>
      
      <h2 style="color: #60a5fa; font-size: 2.5rem; font-weight: 900; margin-top: 4rem; margin-bottom: 2rem; font-family: 'SF Mono', 'Monaco', monospace; letter-spacing: -0.02em;">&lt;Implementation Roadmap /&gt;</h2>
      
      <p style="font-size: 1.125rem; line-height: 1.8; color: #cbd5e1; margin-bottom: 2rem;">Successfully implementing AI in HR requires thoughtful planning and execution. Here's a practical roadmap:</p>
      
      <div style="background: #0f172a; border: 1px solid #334155; border-radius: 1rem; padding: 2.5rem; margin: 2.5rem 0;">
        <div style="margin-bottom: 2.5rem;">
          <h4 style="color: #60a5fa; font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; font-family: 'SF Mono', 'Monaco', monospace;">01 // Define Clear Objectives</h4>
          <p style="color: #94a3b8; font-size: 1rem; line-height: 1.7; margin: 0;">Don't implement AI for its own sake. Identify specific pain points or opportunities where AI can add value. Set measurable goals.</p>
        </div>
        
        <div style="margin-bottom: 2.5rem;">
          <h4 style="color: #60a5fa; font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; font-family: 'SF Mono', 'Monaco', monospace;">02 // Assess Data Readiness</h4>
          <p style="color: #94a3b8; font-size: 1rem; line-height: 1.7; margin: 0;">AI is only as good as the data that trains it. Audit your current data for quality, completeness, and potential bias.</p>
        </div>
        
        <div style="margin-bottom: 2.5rem;">
          <h4 style="color: #60a5fa; font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; font-family: 'SF Mono', 'Monaco', monospace;">03 // Start Small, Learn Fast</h4>
          <p style="color: #94a3b8; font-size: 1rem; line-height: 1.7; margin: 0;">Begin with a pilot project in one area. Learn from the experience before scaling across the organization.</p>
        </div>
        
        <div style="margin-bottom: 2.5rem;">
          <h4 style="color: #60a5fa; font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; font-family: 'SF Mono', 'Monaco', monospace;">04 // Invest in Change Management</h4>
          <p style="color: #94a3b8; font-size: 1rem; line-height: 1.7; margin: 0;">Technology alone doesn't create value—adoption does. Invest in training, communication, and support to help HR teams embrace new tools.</p>
        </div>
        
        <div>
          <h4 style="color: #60a5fa; font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; font-family: 'SF Mono', 'Monaco', monospace;">05 // Measure & Iterate</h4>
          <p style="color: #94a3b8; font-size: 1rem; line-height: 1.7; margin: 0;">Continuously monitor performance against your objectives. Be prepared to adjust based on what you learn.</p>
        </div>
      </div>
      
      <h2 style="color: #60a5fa; font-size: 2.5rem; font-weight: 900; margin-top: 4rem; margin-bottom: 2rem; font-family: 'SF Mono', 'Monaco', monospace; letter-spacing: -0.02em;">&lt;Looking Forward /&gt;</h2>
      
      <p style="font-size: 1.125rem; line-height: 1.8; color: #cbd5e1; margin-bottom: 2rem;">The AI revolution in HR is still in its early stages. As the technology matures, we can expect even more sophisticated applications—from AI that can detect team dynamics and suggest interventions, to systems that can predict organizational cultural issues before they become critical.</p>
      
      <p style="font-size: 1.125rem; line-height: 1.8; color: #cbd5e1; margin-bottom: 2rem;">But one thing won't change: the fundamentally human nature of HR work. AI is a tool, not a replacement. The most successful organizations will be those that use AI to enhance human judgment, not substitute for it—freeing HR professionals to focus on the empathy, creativity, and strategic thinking that only humans can provide.</p>
      
      <p style="font-size: 1.125rem; line-height: 1.8; color: #cbd5e1; margin-bottom: 4rem;">The future of HR is neither fully automated nor entirely manual—it's a thoughtful blend of human expertise amplified by intelligent technology. Organizations that master this balance will have a significant competitive advantage in attracting, developing, and retaining talent.</p>
      
      <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); padding: 3.5rem; border-radius: 1.25rem; text-align: center; margin-top: 4rem;">
        <h3 style="font-size: 2rem; font-weight: 900; margin-bottom: 1rem; text-shadow: 0 2px 10px rgba(0,0,0,0.2);">Ready to Explore AI for Your HR Function?</h3>
        <p style="font-size: 1.125rem; line-height: 1.7; margin-bottom: 2rem; opacity: 0.95;">Connect with our HR technology experts to discuss how AI can transform your people operations.</p>
        <a href="#" style="display: inline-block; background: white; color: #1e40af; padding: 1rem 2.5rem; border-radius: 0.75rem; font-weight: 700; text-decoration: none;">Schedule a Consultation</a>
      </div>
    </div>
  </div>
</div>
    `,
  },
  {
    id: "editorial-classic",
    name: "Editorial Classic",
    description: "Traditional magazine-style layout for long-form content and in-depth analysis",
    category: "editorial",
    preview: "📰",
    html: `
<div style="max-width: 900px; margin: 0 auto; font-family: 'Georgia', serif; padding: 4rem 3rem;">
  <div style="border-top: 5px solid #18181b; border-bottom: 5px solid #18181b; padding: 2.5rem 0; margin-bottom: 4rem;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; font-family: 'Inter', sans-serif; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.15em; color: #71717a;">
      <span>HR MARKET QUARTERLY</span>
      <span>VOLUME 1, ISSUE 1 • JANUARY 2025</span>
    </div>
    <h1 style="font-size: 4rem; font-weight: 700; line-height: 1.1; margin-bottom: 1.5rem; color: #18181b; letter-spacing: -0.02em;">The State of Human Resources: A Comprehensive Analysis</h1>
    <p style="font-size: 1.625rem; color: #52525b; line-height: 1.5; font-style: italic; margin-bottom: 2rem;">An in-depth examination of current trends, emerging challenges, and strategic opportunities shaping the future of HR management in the post-pandemic era</p>
    <div style="display: flex; align-items: center; gap: 1.5rem; font-family: 'Inter', sans-serif; font-size: 0.875rem; color: #71717a; border-top: 1px solid #e4e4e7; padding-top: 2rem;">
      <span style="font-weight: 600;">SPECIAL REPORT</span>
      <span>•</span>
      <span>20 min read</span>
      <span>•</span>
      <span>Research-based insights</span>
    </div>
  </div>
  
  <div style="display: grid; grid-template-columns: 1fr 3fr; gap: 3rem; margin-bottom: 4rem; font-family: 'Inter', sans-serif; font-size: 0.875rem; color: #71717a; padding-bottom: 3rem; border-bottom: 1px solid #e4e4e7;">
    <div>
      <p style="margin: 0 0 0.5rem 0; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #18181b; font-size: 0.75rem;">Research Team</p>
      <p style="margin: 0; line-height: 1.6;">Dr. Elizabeth Morgan, Chief Research Officer</p>
      <p style="margin: 0; line-height: 1.6;">Marcus Chen, Senior Analyst</p>
      <p style="margin: 0; line-height: 1.6;">Sarah Williams, Data Scientist</p>
    </div>
    <div>
      <p style="margin: 0 0 0.5rem 0; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #18181b; font-size: 0.75rem;">About this Report</p>
      <p style="margin: 0; line-height: 1.7;">This comprehensive analysis draws on survey data from 2,500+ HR professionals, interviews with industry leaders, and examination of workforce trends across 15 countries. Our research identifies key patterns emerging in human capital management and provides actionable insights for HR leadership.</p>
    </div>
  </div>
  
  <div style="font-size: 1.25rem; line-height: 1.9; color: #3f3f46;">
    <p style="margin-bottom: 2rem; font-size: 1.5rem; font-weight: 600; line-height: 1.6; color: #18181b;">Human resources stands at a critical inflection point. The convergence of technological advancement, shifting workforce demographics, and evolving employee expectations has created both unprecedented challenges and remarkable opportunities for organizations that can adapt strategically.</p>
    
    <p style="margin-bottom: 2rem;">This report synthesizes findings from extensive research conducted over the past 18 months, examining how leading organizations are navigating this transformative period. Our goal is to provide HR leaders with evidence-based insights to inform strategic decision-making in an increasingly complex landscape.</p>
    
    <h2 style="font-size: 2.5rem; font-weight: 700; margin-top: 5rem; margin-bottom: 2rem; color: #18181b; border-bottom: 3px solid #18181b; padding-bottom: 1rem; letter-spacing: -0.01em;">I. The Changing Workforce Landscape</h2>
    
    <h3 style="font-size: 1.875rem; font-weight: 600; margin-top: 3rem; margin-bottom: 1.5rem; color: #18181b;">Demographic Shifts</h3>
    
    <p style="margin-bottom: 2rem;">For the first time in history, five distinct generations occupy the workplace simultaneously. This unprecedented diversity brings varied perspectives, communication styles, and expectations regarding work arrangements, career progression, and organizational culture.</p>
    
    <p style="margin-bottom: 2rem;">Generation Z, now entering the workforce in significant numbers, demonstrates markedly different priorities compared to their predecessors. Our research reveals that 78% of Gen Z workers prioritize purpose and values alignment over salary when evaluating employment opportunities—a stark contrast to patterns observed in previous generations.</p>
    
    <div style="background: #fafafa; border-left: 5px solid #18181b; padding: 2.5rem; margin: 3rem 0; font-family: 'Inter', sans-serif;">
      <p style="font-size: 0.875rem; font-weight: 700; color: #18181b; margin-bottom: 1.5rem; text-transform: uppercase; letter-spacing: 0.05em;">KEY FINDING</p>
      <p style="font-size: 1.125rem; line-height: 1.7; color: #52525b; margin-bottom: 1.5rem;">Organizations that successfully integrate multigenerational teams report 35% higher innovation metrics and 28% better employee retention compared to those struggling with generational integration.</p>
      <p style="font-size: 0.875rem; line-height: 1.6; color: #71717a; margin: 0; font-style: italic;">Source: HR Market Quarterly Survey, 2024 (n=2,547)</p>
    </div>
    
    <h3 style="font-size: 1.875rem; font-weight: 600; margin-top: 3rem; margin-bottom: 1.5rem; color: #18181b;">The Remote Revolution</h3>
    
    <p style="margin-bottom: 2rem;">The rapid shift to remote work, initially driven by pandemic necessity, has permanently altered workforce expectations. Our data indicates that 64% of knowledge workers would consider leaving their current role if required to return to office full-time—a figure that rises to 81% among workers under 35.</p>
    
    <p style="margin-bottom: 2rem;">However, the narrative of "remote versus office" presents a false dichotomy. The most successful organizations have moved beyond this binary to embrace hybrid models tailored to their specific context, culture, and business needs.</p>
    
    <h2 style="font-size: 2.5rem; font-weight: 700; margin-top: 5rem; margin-bottom: 2rem; color: #18181b; border-bottom: 3px solid #18181b; padding-bottom: 1rem; letter-spacing: -0.01em;">II. Emerging HR Priorities</h2>
    
    <p style="margin-bottom: 2rem;">Our research identified five critical priorities dominating HR strategic planning for the coming years:</p>
    
    <h3 style="font-size: 1.875rem; font-weight: 600; margin-top: 3rem; margin-bottom: 1.5rem; color: #18181b;">1. Skills-Based Organizational Design</h3>
    
    <p style="margin-bottom: 2rem;">Traditional hierarchical structures and role-based thinking are giving way to more fluid, skills-based approaches. Progressive organizations are mapping employee capabilities, identifying skill gaps, and creating development pathways independent of traditional promotional ladders.</p>
    
    <p style="margin-bottom: 2rem;">This shift requires fundamental changes to talent management systems. Job descriptions become skill profiles. Performance reviews assess competency development. Internal mobility matches people to projects based on capabilities rather than titles.</p>
    
    <div style="background: linear-gradient(to right, #f9fafb, #ffffff); border: 1px solid #e4e4e7; padding: 3rem; margin: 3rem 0; border-radius: 0.5rem;">
      <h4 style="font-size: 1.375rem; font-weight: 700; color: #18181b; margin-bottom: 2rem; font-family: 'Inter', sans-serif;">Case Study: Global Financial Services Firm</h4>
      <p style="font-size: 1rem; line-height: 1.7; color: #52525b; margin-bottom: 1.5rem; font-family: 'Inter', sans-serif;">After implementing a skills-based talent marketplace, this 15,000-employee organization saw:</p>
      <ul style="font-size: 1rem; line-height: 1.7; color: #52525b; margin-bottom: 1.5rem; padding-left: 2rem; font-family: 'Inter', sans-serif;">
        <li style="margin-bottom: 0.75rem;">47% increase in internal mobility</li>
        <li style="margin-bottom: 0.75rem;">62% reduction in external hiring for mid-level roles</li>
        <li style="margin-bottom: 0.75rem;">23% improvement in employee engagement scores</li>
        <li>$12M annual savings in recruiting and onboarding costs</li>
      </ul>
      <p style="font-size: 0.875rem; line-height: 1.6; color: #71717a; margin: 0; font-style: italic; font-family: 'Inter', sans-serif;">"The shift to skills-based thinking fundamentally changed how our people think about their careers. We're no longer climbing a ladder—we're building portfolios of capabilities." — Chief Talent Officer</p>
    </div>
    
    <h3 style="font-size: 1.875rem; font-weight: 600; margin-top: 3rem; margin-bottom: 1.5rem; color: #18181b;">2. Employee Experience Architecture</h3>
    
    <p style="margin-bottom: 2rem;">Leading organizations are adopting design thinking methodologies traditionally associated with customer experience to reimagine employee journeys. This involves mapping touchpoints from recruitment through offboarding, identifying pain points, and systematically improving interactions.</p>
    
    <p style="margin-bottom: 2rem;">This approach recognizes that employee experience is not owned by HR alone—it's the cumulative result of countless interactions across the organization. HR's role evolves from service provider to experience architect, working cross-functionally to create coherent, positive employee journeys.</p>
    
    <h3 style="font-size: 1.875rem; font-weight: 600; margin-top: 3rem; margin-bottom: 1.5rem; color: #18181b;">3. Data-Driven Decision Making</h3>
    
    <p style="margin-bottom: 2rem;">The maturation of people analytics capabilities is enabling more sophisticated, evidence-based HR strategies. Organizations are moving beyond descriptive metrics (what happened) to predictive and prescriptive analytics (what will happen, and what should we do about it).</p>
    
    <p style="margin-bottom: 2rem;">However, our research reveals a significant implementation gap. While 89% of HR leaders believe data analytics is critical to their function's future, only 31% report having adequate analytical capabilities or talent within their teams.</p>
    
    <h3 style="font-size: 1.875rem; font-weight: 600; margin-top: 3rem; margin-bottom: 1.5rem; color: #18181b;">4. Holistic Wellbeing Programs</h3>
    
    <p style="margin-bottom: 2rem;">The concept of employee wellbeing has expanded far beyond traditional health benefits. Progressive employers are addressing physical, mental, financial, and social dimensions of wellness through comprehensive programs.</p>
    
    <p style="margin-bottom: 2rem;">The business case is compelling: organizations with mature wellbeing strategies report 40% lower healthcare costs, 50% fewer safety incidents, and 30% higher employee engagement compared to those with basic offerings.</p>
    
    <h3 style="font-size: 1.875rem; font-weight: 600; margin-top: 3rem; margin-bottom: 1.5rem; color: #18181b;">5. Diversity, Equity, and Inclusion</h3>
    
    <p style="margin-bottom: 2rem;">DEI has evolved from compliance imperative to strategic priority. The most sophisticated organizations approach DEI as systemic work requiring long-term commitment, measurement, and accountability—not as a series of isolated programs or trainings.</p>
    
    <p style="margin-bottom: 2rem;">Our research identified several characteristics common to organizations making meaningful DEI progress: executive sponsorship extending beyond HR, integration of DEI metrics into business scorecards, transparent reporting on representation and pay equity, and sustained investment over multi-year timeframes.</p>
    
    <h2 style="font-size: 2.5rem; font-weight: 700; margin-top: 5rem; margin-bottom: 2rem; color: #18181b; border-bottom: 3px solid #18181b; padding-bottom: 1rem; letter-spacing: -0.01em;">III. Technology's Transformative Role</h2>
    
    <p style="margin-bottom: 2rem;">Technology is fundamentally reshaping HR work, but not in the ways initially predicted. Rather than replacing HR professionals, technology is augmenting their capabilities and shifting their focus toward higher-value strategic activities.</p>
    
    <p style="margin-bottom: 2rem;">Artificial intelligence handles administrative tasks, chatbots answer routine questions, and analytics platforms surface insights from massive datasets. This automation liberates HR practitioners to focus on uniquely human work: coaching, relationship building, change management, and strategic planning.</p>
    
    <div style="background: #18181b; color: white; padding: 3rem; margin: 4rem 0; border-radius: 0.5rem;">
      <h3 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 2rem; font-family: 'Inter', sans-serif;">Technology Adoption Snapshot</h3>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem;">
        <div style="padding: 2rem; background: rgba(255,255,255,0.1); border-radius: 0.5rem;">
          <p style="color: #93c5fd; font-size: 3rem; font-weight: 900; margin-bottom: 0.5rem; font-family: 'Inter', sans-serif;">74%</p>
          <p style="color: #e4e4e7; font-size: 0.875rem; line-height: 1.5; margin: 0; font-family: 'Inter', sans-serif;">of organizations have adopted or plan to adopt AI-powered HR tools within 24 months</p>
        </div>
        <div style="padding: 2rem; background: rgba(255,255,255,0.1); border-radius: 0.5rem;">
          <p style="color: #93c5fd; font-size: 3rem; font-weight: 900; margin-bottom: 0.5rem; font-family: 'Inter', sans-serif;">$4.2M</p>
          <p style="color: #e4e4e7; font-size: 0.875rem; line-height: 1.5; margin: 0; font-family: 'Inter', sans-serif;">average annual savings from HR technology automation for organizations with 5,000+ employees</p>
        </div>
        <div style="padding: 2rem; background: rgba(255,255,255,0.1); border-radius: 0.5rem;">
          <p style="color: #93c5fd; font-size: 3rem; font-weight: 900; margin-bottom: 0.5rem; font-family: 'Inter', sans-serif;">58%</p>
          <p style="color: #e4e4e7; font-size: 0.875rem; line-height: 1.5; margin: 0; font-family: 'Inter', sans-serif;">of HR leaders cite change management as their biggest technology implementation challenge</p>
        </div>
        <div style="padding: 2rem; background: rgba(255,255,255,0.1); border-radius: 0.5rem;">
          <p style="color: #93c5fd; font-size: 3rem; font-weight: 900; margin-bottom: 0.5rem; font-family: 'Inter', sans-serif;">92%</p>
          <p style="color: #e4e4e7; font-size: 0.875rem; line-height: 1.5; margin: 0; font-family: 'Inter', sans-serif;">believe technology will increase HR's strategic impact over the next five years</p>
        </div>
      </div>
    </div>
    
    <h2 style="color: #60a5fa; font-size: 2.5rem; font-weight: 900; margin-top: 4rem; margin-bottom: 2rem; font-family: 'SF Mono', 'Monaco', monospace; letter-spacing: -0.02em;">IV. Strategic Recommendations</h2>
    
    <p style="font-size: 1.125rem; line-height: 1.8; color: #cbd5e1; margin-bottom: 2rem;">Based on our comprehensive analysis, we offer the following strategic recommendations for HR leaders:</p>
    
    <p style="margin-bottom: 1.5rem;"><strong style="color: #18181b; font-size: 1.125rem;">Embrace continuous transformation.</strong> The pace of change will not slow. Build organizational muscles for adaptation, experimentation, and learning. Create space for pilots and iteration.</p>
    
    <p style="margin-bottom: 1.5rem;"><strong style="color: #18181b; font-size: 1.125rem;">Invest in HR capabilities.</strong> The complexity of modern HR work demands sophisticated skills. Invest in upskilling your HR team in areas like data analytics, change management, and strategic business partnering.</p>
    
    <p style="margin-bottom: 1.5rem;"><strong style="color: #18181b; font-size: 1.125rem;">Adopt an enterprise perspective.</strong> HR's most significant opportunities lie in enabling enterprise-wide transformation, not just managing HR processes. Build relationships with business leaders and contribute to strategic discussions.</p>
    
    <p style="margin-bottom: 1.5rem;"><strong style="color: #18181b; font-size: 1.125rem;">Measure what matters.</strong> Develop metrics that demonstrate HR's impact on business outcomes, not just HR efficiency. Connect people data to business performance.</p>
    
    <p style="margin-bottom: 3rem;"><strong style="color: #18181b; font-size: 1.125rem;">Lead with empathy.</strong> Amid all the technology and data, never lose sight of HR's fundamentally human mission. The most effective HR leaders combine analytical rigor with genuine care for people.</p>
    
    <h2 style="font-size: 2.5rem; font-weight: 700; margin-top: 5rem; margin-bottom: 2rem; color: #18181b; border-bottom: 3px solid #18181b; padding-bottom: 1rem; letter-spacing: -0.01em;">Conclusion</h2>
    
    <p style="margin-bottom: 2rem;">Human resources stands at the threshold of its most significant transformation yet. The convergence of technological capability, workforce evolution, and elevated business expectations creates an unprecedented opportunity for HR to demonstrate strategic value.</p>
    
    <p style="margin-bottom: 2rem;">Success in this new era requires HR leaders who can bridge multiple worlds: combining data fluency with human insight, balancing efficiency with empathy, and maintaining focus on both immediate operations and long-term strategy.</p>
    
    <p style="margin-bottom: 4rem;">The organizations that thrive will be those that recognize HR not as a support function, but as a critical driver of competitive advantage. Those that invest in their people, their processes, and their HR capabilities will be positioned to attract top talent, drive innovation, and build cultures of sustainable high performance.</p>
    
    <div style="border-top: 2px solid #e4e4e7; border-bottom: 2px solid #e4e4e7; padding: 3rem 0; margin: 5rem 0; font-family: 'Inter', sans-serif;">
      <h4 style="font-size: 0.875rem; font-weight: 700; color: #71717a; margin-bottom: 2rem; text-transform: uppercase; letter-spacing: 0.1em;">About HR Market Quarterly</h4>
      <p style="font-size: 1rem; line-height: 1.8; color: #52525b; margin-bottom: 1.5rem;">HR Market Quarterly is the leading publication for human resources professionals seeking research-based insights and strategic guidance. Our team of researchers, analysts, and practitioners examines trends shaping the future of work.</p>
      <p style="font-size: 0.875rem; line-height: 1.7; color: #71717a; margin: 0;">For questions about this research or to discuss custom studies for your organization, contact research@hrmarket.com</p>
    </div>
  </div>
</div>
    `,
  },
  {
    id: "corporate-event",
    name: "Corporate Event",
    description: "Modern, clean design for business conferences and professional development events",
    category: "corporate-event",
    preview: "🎓",
    html: `
<div style="font-family: 'Inter', sans-serif; background: #f8fafc; color: #0f172a;">
  <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; padding: 5rem 3rem; position: relative; overflow: hidden;">
    <div style="position: absolute; top: -10%; right: -5%; width: 600px; height: 600px; background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%); border-radius: 50%;"></div>
    <div style="position: absolute; bottom: -15%; left: -10%; width: 700px; height: 700px; background: radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%); border-radius: 50%;"></div>
    
    <div style="max-width: 1200px; margin: 0 auto; position: relative; z-index: 10;">
      <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem;">
        <div style="background: linear-gradient(135deg, #3b82f6, #6366f1); padding: 0.75rem 1.5rem; border-radius: 0.5rem;">
          <p style="color: white; font-size: 0.875rem; font-weight: 800; letter-spacing: 0.1rem; margin: 0;">MARCH 15-17, 2025</p>
        </div>
        <div style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); padding: 0.75rem 1.5rem; border-radius: 0.5rem;">
          <p style="color: #93c5fd; font-size: 0.875rem; font-weight: 700; margin: 0;">3-DAY EVENT</p>
        </div>
      </div>
      
      <h1 style="font-size: 5rem; font-weight: 900; line-height: 1; margin-bottom: 2rem; letter-spacing: -0.03em; background: linear-gradient(135deg, #ffffff 0%, #93c5fd 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Future of Work Summit 2025</h1>
      
      <p style="font-size: 1.75rem; line-height: 1.5; color: #cbd5e1; margin-bottom: 3rem; font-weight: 500;">Where innovation meets implementation: Join 1,500+ HR leaders, executives, and thought leaders shaping the next era of workplace excellence</p>
      
      <div style="display: flex; gap: 3rem; align-items: center; flex-wrap: wrap; font-size: 1.125rem; color: #94a3b8; margin-bottom: 3rem;">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <span style="color: #60a5fa; font-size: 1.5rem;">📍</span>
          <span>Silicon Valley Convention Center</span>
        </div>
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <span style="color: #60a5fa; font-size: 1.5rem;">🎤</span>
          <span>50+ Industry Experts</span>
        </div>
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <span style="color: #60a5fa; font-size: 1.5rem;">🏢</span>
          <span>100+ Exhibitors</span>
        </div>
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <span style="color: #60a5fa; font-size: 1.5rem;">🌐</span>
          <span>Hybrid: In-Person & Virtual</span>
        </div>
      </div>
      
      <div style="display: flex; gap: 2rem; flex-wrap: wrap;">
        <a href="#" style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #6366f1); color: white; padding: 1.25rem 3rem; border-radius: 0.75rem; font-weight: 700; text-decoration: none; font-size: 1.125rem; box-shadow: 0 10px 40px rgba(59, 130, 246, 0.4);">Register Now - Early Bird</a>
        <a href="#" style="display: inline-block; background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border: 2px solid rgba(255,255,255,0.2); color: white; padding: 1.25rem 3rem; border-radius: 0.75rem; font-weight: 700; text-decoration: none; font-size: 1.125rem; text-transform: uppercase; letter-spacing: 0.05em;">Download Brochure</a>
      </div>
    </div>
  </div>
  
  <div style="max-width: 1400px; margin: 0 auto; padding: 6rem 3rem;">
    <div style="text-align: center; margin-bottom: 5rem;">
      <p style="color: #3b82f6; font-size: 1rem; font-weight: 700; letter-spacing: 0.1rem; margin-bottom: 1rem; text-transform: uppercase;">Conference Highlights</p>
      <h2 style="font-size: 3.5rem; font-weight: 900; color: #0f172a; margin-bottom: 2rem; letter-spacing: -0.02em;">What You'll Experience</h2>
      <p style="font-size: 1.25rem; color: #475569; line-height: 1.8; max-width: 800px; margin: 0 auto;">Three days packed with insights, connections, and actionable strategies to transform your organization</p>
    </div>
    
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(380px, 1fr)); gap: 3rem; margin-bottom: 6rem;">
      <div style="background: white; border: 1px solid #e2e8f0; padding: 3rem; border-radius: 1.25rem; box-shadow: 0 4px 20px rgba(0,0,0,0.05); transition: transform 0.3s;">
        <div style="width: 70px; height: 70px; background: linear-gradient(135deg, #3b82f6, #6366f1); border-radius: 1rem; display: flex; align-items: center; justify-content: center; font-size: 2rem; margin-bottom: 2rem;">🎯</div>
        <h3 style="color: #0f172a; font-size: 1.75rem; font-weight: 800; margin-bottom: 1.25rem;">Keynote Sessions</h3>
        <p style="color: #475569; font-size: 1.125rem; line-height: 1.8; margin-bottom: 1.5rem;">Hear from visionary CEOs, bestselling authors, and pioneering HR leaders on topics ranging from AI integration to culture transformation.</p>
        <ul style="color: #64748b; font-size: 1rem; line-height: 1.8; margin: 0; padding-left: 1.5rem;">
          <li>Morning keynotes from Fortune 500 leaders</li>
          <li>Afternoon deep-dives with industry experts</li>
          <li>Closing vision session on the decade ahead</li>
        </ul>
      </div>
      
      <div style="background: white; border: 1px solid #e2e8f0; padding: 3rem; border-radius: 1.25rem; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
        <div style="width: 70px; height: 70px; background: linear-gradient(135deg, #3b82f6, #6366f1); border-radius: 1rem; display: flex; align-items: center; justify-content: center; font-size: 2rem; margin-bottom: 2rem;">💼</div>
        <h3 style="color: #0f172a; font-size: 1.75rem; font-weight: 800; margin-bottom: 1.25rem;">Interactive Workshops</h3>
        <p style="color: #475569; font-size: 1.125rem; line-height: 1.8; margin-bottom: 1.5rem;">Roll up your sleeves in hands-on sessions designed to give you immediately applicable skills and frameworks.</p>
        <ul style="color: #64748b; font-size: 1rem; line-height: 1.8; margin: 0; padding-left: 1.5rem;">
          <li>Data analytics for HR professionals</li>
          <li>Building high-performance teams</li>
          <li>Change management certification track</li>
        </ul>
      </div>
      
      <div style="background: white; border: 1px solid #e2e8f0; padding: 3rem; border-radius: 1.25rem; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
        <div style="width: 70px; height: 70px; background: linear-gradient(135deg, #3b82f6, #6366f1); border-radius: 1rem; display: flex; align-items: center; justify-content: center; font-size: 2rem; margin-bottom: 2rem;">🤝</div>
        <h3 style="color: #0f172a; font-size: 1.75rem; font-weight: 800; margin-bottom: 1.25rem;">Networking Opportunities</h3>
        <p style="color: #475569; font-size: 1.125rem; line-height: 1.8; margin-bottom: 1.5rem;">Connect with peers facing similar challenges, build relationships that last beyond the conference.</p>
        <ul style="color: #64748b; font-size: 1rem; line-height: 1.8; margin: 0; padding-left: 1.5rem;">
          <li>Structured networking sessions</li>
          <li>Industry-specific roundtables</li>
          <li>Evening receptions and social events</li>
        </ul>
      </div>
      
      <div style="background: white; border: 1px solid #e2e8f0; padding: 3rem; border-radius: 1.25rem; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
        <div style="width: 70px; height: 70px; background: linear-gradient(135deg, #3b82f6, #6366f1); border-radius: 1rem; display: flex; align-items: center; justify-content: center; font-size: 2rem; margin-bottom: 2rem;">🚀</div>
        <h3 style="color: #0f172a; font-size: 1.75rem; font-weight: 800; margin-bottom: 1.25rem;">Innovation Showcase</h3>
        <p style="color: #475569; font-size: 1.125rem; line-height: 1.8; margin-bottom: 1.5rem;">Explore cutting-edge HR technology solutions from 100+ exhibitors on the show floor.</p>
        <ul style="color: #64748b; font-size: 1rem; line-height: 1.8; margin: 0; padding-left: 1.5rem;">
          <li>Live product demonstrations</li>
          <li>Exclusive conference discounts</li>
          <li>One-on-one consultations with vendors</li>
        </ul>
      </div>
      
      <div style="background: white; border: 1px solid #e2e8f0; padding: 3rem; border-radius: 1.25rem; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
        <div style="width: 70px; height: 70px; background: linear-gradient(135deg, #3b82f6, #6366f1); border-radius: 1rem; display: flex; align-items: center; justify-content: center; font-size: 2rem; margin-bottom: 2rem;">📊</div>
        <h3 style="color: #0f172a; font-size: 1.75rem; font-weight: 800; margin-bottom: 1.25rem;">Research & Insights</h3>
        <p style="color: #475569; font-size: 1.125rem; line-height: 1.8; margin-bottom: 1.5rem;">Access exclusive research reports and benchmarking data available only to conference attendees.</p>
        <ul style="color: #64748b; font-size: 1rem; line-height: 1.8; margin: 0; padding-left: 1.5rem;">
          <li>2025 State of HR Report</li>
          <li>Salary benchmarking database</li>
          <li>Case study library with 200+ examples</li>
        </ul>
      </div>
      
      <div style="background: white; border: 1px solid #e2e8f0; padding: 3rem; border-radius: 1.25rem; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
        <div style="width: 70px; height: 70px; background: linear-gradient(135deg, #3b82f6, #6366f1); border-radius: 1rem; display: flex; align-items: center; justify-content: center; font-size: 2rem; margin-bottom: 2rem;">🎓</div>
        <h3 style="color: #0f172a; font-size: 1.75rem; font-weight: 800; margin-bottom: 1.25rem;">Professional Development</h3>
        <p style="color: #475569; font-size: 1.125rem; line-height: 1.8; margin-bottom: 1.5rem;">Earn continuing education credits and certifications to advance your career.</p>
        <ul style="color: #64748b; font-size: 1rem; line-height: 1.8; margin: 0; padding-left: 1.5rem;">
          <li>24 HRCI and SHRM credits available</li>
          <li>Certificate programs in specialized tracks</li>
          <li>Post-conference learning resources</li>
        </ul>
      </div>
    </div>
    
    <div style="background: linear-gradient(135deg, #eff6ff, #dbeafe); padding: 5rem 4rem; border-radius: 2rem; margin: 6rem 0;">
      <div style="text-align: center; margin-bottom: 4rem;">
        <h2 style="color: #1e40af; font-size: 3rem; font-weight: 900; margin-bottom: 1.5rem;">Featured Speakers</h2>
        <p style="color: #1e40af; font-size: 1.25rem;">Learn from the best minds in business and HR</p>
      </div>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 3rem;">
        <div style="background: white; padding: 2.5rem; border-radius: 1.25rem; text-align: center; box-shadow: 0 4px 20px rgba(59, 130, 246, 0.1);">
          <div style="width: 140px; height: 140px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6, #6366f1); margin: 0 auto 2rem; display: flex; align-items: center; justify-content: center; font-size: 4rem;">👩‍💼</div>
          <h3 style="color: #0f172a; font-size: 1.5rem; font-weight: 800; margin-bottom: 0.5rem;">Dr. Jennifer Chen</h3>
          <p style="color: #3b82f6; font-size: 1rem; font-weight: 600; margin-bottom: 1rem;">Chief People Officer, InnovateTech</p>
          <p style="color: #64748b; font-size: 0.875rem; font-style: italic; margin-bottom: 1.5rem;">"AI-Powered Talent Management: Reality vs. Hype"</p>
          <p style="color: #475569; font-size: 1rem; line-height: 1.7; margin: 0;">Former VP at Google, author of "The Digital HR Revolution", recognized as Top 10 HR Influencer</p>
        </div>
        
        <div style="background: white; padding: 2.5rem; border-radius: 1.25rem; text-align: center; box-shadow: 0 4px 20px rgba(59, 130, 246, 0.1);">
          <div style="width: 140px; height: 140px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6, #6366f1); margin: 0 auto 2rem; display: flex; align-items: center; justify-content: center; font-size: 4rem;">👨‍🏫</div>
          <h3 style="color: #0f172a; font-size: 1.5rem; font-weight: 800; margin-bottom: 0.5rem;">Marcus Williams</h3>
          <p style="color: #3b82f6; font-size: 1rem; font-weight: 600; margin-bottom: 1rem;">CEO, FutureWork Institute</p>
          <p style="color: #64748b; font-size: 0.875rem; font-style: italic; margin-bottom: 1.5rem;">"Building Resilient Organizations in Uncertain Times"</p>
          <p style="color: #475569; font-size: 1rem; line-height: 1.7; margin: 0;">NYT bestselling author, keynote at WEF, advises Fortune 100 companies on organizational design</p>
        </div>
        
        <div style="background: white; padding: 2.5rem; border-radius: 1.25rem; text-align: center; box-shadow: 0 4px 20px rgba(59, 130, 246, 0.1);">
          <div style="width: 140px; height: 140px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6, #6366f1); margin: 0 auto 2rem; display: flex; align-items: center; justify-content: center; font-size: 4rem;">👩‍💻</div>
          <h3 style="color: #0f172a; font-size: 1.5rem; font-weight: 800; margin-bottom: 0.5rem;">Sarah Patel</h3>
          <p style="color: #3b82f6; font-size: 1rem; font-weight: 600; margin-bottom: 1rem;">Founder, DEI Solutions Global</p>
          <p style="color: #64748b; font-size: 0.875rem; font-style: italic; margin-bottom: 1.5rem;">"From Intention to Impact: Measurable DEI Strategies"</p>
          <p style="color: #475569; font-size: 1rem; line-height: 1.7; margin: 0;">TEDx speaker, Harvard Business Review contributor, transformed DEI at 50+ organizations</p>
        </div>
      </div>
    </div>
    
    <div style="background: linear-gradient(135deg, #0f172a, #1e293b); padding: 5rem 4rem; border-radius: 2rem; text-align: center; margin-top: 6rem;">
      <h2 style="color: white; font-size: 3rem; font-weight: 900; margin-bottom: 2rem;">Registration Options</h2>
      <p style="color: #cbd5e1; font-size: 1.25rem; margin-bottom: 4rem;">Choose the package that's right for you</p>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem; max-width: 1200px; margin: 0 auto;">
        <div style="background: rgba(255,255,255,0.05); backdrop-filter: blur(10px); border: 2px solid rgba(255,255,255,0.1); padding: 3rem; border-radius: 1.25rem;">
          <h3 style="color: #93c5fd; font-size: 1.5rem; font-weight: 800; margin-bottom: 1rem;">Virtual Pass</h3>
          <p style="color: #cbd5e1; font-size: 3rem; font-weight: 900; margin-bottom: 0.5rem;">$299</p>
          <p style="color: #94a3b8; font-size: 0.875rem; margin-bottom: 2rem;">Access all sessions virtually</p>
          <ul style="color: #cbd5e1; font-size: 1rem; line-height: 2; text-align: left; margin: 0 0 2rem 0; padding-left: 1.5rem;">
            <li>Live stream of all keynotes</li>
            <li>On-demand session recordings</li>
            <li>Digital resource library</li>
            <li>Virtual networking platform</li>
          </ul>
          <a href="#" style="display: block; background: rgba(255,255,255,0.1); border: 2px solid rgba(255,255,255,0.2); color: white; padding: 1rem; border-radius: 0.75rem; font-weight: 700; text-decoration: none;">Register Virtual</a>
        </div>
        
        <div style="background: linear-gradient(135deg, #3b82f6, #6366f1); padding: 3rem; border-radius: 1.25rem; position: relative; overflow: hidden; box-shadow: 0 20px 60px rgba(59, 130, 246, 0.4);">
          <div style="position: absolute; top: 1rem; right: 1rem; background: #fbbf24; color: #0f172a; padding: 0.5rem 1rem; border-radius: 2rem; font-size: 0.75rem; font-weight: 800;">MOST POPULAR</div>
          <h3 style="color: white; font-size: 1.5rem; font-weight: 800; margin-bottom: 1rem;">Full Conference</h3>
          <p style="color: white; font-size: 3rem; font-weight: 900; margin-bottom: 0.5rem;">$899</p>
          <p style="color: #dbeafe; font-size: 0.875rem; margin-bottom: 2rem;">Complete in-person experience</p>
          <ul style="color: white; font-size: 1rem; line-height: 2; text-align: left; margin: 0 0 2rem 0; padding-left: 1.5rem;">
            <li>All keynotes & workshops</li>
            <li>Expo hall access</li>
            <li>Meals & refreshments included</li>
            <li>Networking events</li>
            <li>Conference materials & swag</li>
            <li>All virtual pass benefits</li>
          </ul>
          <a href="#" style="display: block; background: white; color: #3b82f6; padding: 1rem; border-radius: 0.75rem; font-weight: 800; text-decoration: none; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">Register Now</a>
        </div>
        
        <div style="background: rgba(255,255,255,0.05); backdrop-filter: blur(10px); border: 2px solid rgba(255,255,255,0.1); padding: 3rem; border-radius: 1.25rem;">
          <h3 style="color: #93c5fd; font-size: 1.5rem; font-weight: 800; margin-bottom: 1rem;">VIP Experience</h3>
          <p style="color: #cbd5e1; font-size: 3rem; font-weight: 900; margin-bottom: 0.5rem;">$1,899</p>
          <p style="color: #94a3b8; font-size: 0.875rem; margin-bottom: 2rem;">Premium access & exclusives</p>
          <ul style="color: #cbd5e1; font-size: 1rem; line-height: 2; text-align: left; margin: 0 0 2rem 0; padding-left: 1.5rem;">
            <li>All Full Conference benefits</li>
            <li>VIP seating at keynotes</li>
            <li>Private speaker meet & greets</li>
            <li>Executive roundtable dinners</li>
            <li>Exclusive pre-conference workshop</li>
            <li>Concierge service</li>
          </ul>
          <a href="#" style="display: block; background: rgba(255,255,255,0.1); border: 2px solid rgba(255,255,255,0.2); color: white; padding: 1rem; border-radius: 0.75rem; font-weight: 700; text-decoration: none;">Register VIP</a>
        </div>
      </div>
      
      <p style="color: #94a3b8; font-size: 1rem; margin-top: 3rem;">🎯 Early bird discount ends February 15th - Save 25%!</p>
    </div>
  </div>
</div>
    `,
  },
  {
    id: "corporate-gala",
    name: "Corporate Gala Evening",
    description: "Elegant, sophisticated design for high-end corporate events and award ceremonies",
    category: "corporate-event",
    preview: "🎭",
    html: `
<div style="font-family: 'Inter', sans-serif; background: linear-gradient(180deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%); color: white; padding: 0;">
  <div style="position: relative; overflow: hidden; padding: 6rem 3rem; background: url('/elegant-corporate-event-ballroom-with-chandeliers.jpg') center/cover; background-blend-mode: overlay; background-color: rgba(30, 27, 75, 0.85);">
    <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.2) 0%, transparent 70%);"></div>
    
    <div style="position: relative; z-index: 10; max-width: 1200px; margin: 0 auto; text-align: center;">
      <div style="display: inline-block; border: 3px solid #fbbf24; padding: 0.5rem 2rem; margin-bottom: 2rem; background: rgba(251, 191, 36, 0.1); backdrop-filter: blur(10px);">
        <p style="color: #fbbf24; font-size: 0.875rem; font-weight: 800; letter-spacing: 0.2rem; margin: 0; text-transform: uppercase;">Black Tie Event</p>
      </div>
      
      <h1 style="font-size: 5rem; font-weight: 900; line-height: 1.1; margin-bottom: 2rem; color: white; text-shadow: 0 4px 20px rgba(0,0,0,0.5); letter-spacing: -0.02em;">Annual Excellence Awards Gala 2025</h1>
      
      <div style="width: 150px; height: 3px; background: linear-gradient(90deg, transparent, #fbbf24, transparent); margin: 2rem auto;"></div>
      
      <p style="font-size: 1.875rem; line-height: 1.5; color: #e0e7ff; margin-bottom: 3rem; font-weight: 300; max-width: 900px; margin-left: auto; margin-right: auto;">An evening of celebration, recognition, and inspiration as we honor the outstanding achievements of our team and partners</p>
      
      <div style="display: flex; justify-content: center; align-items: center; gap: 3rem; flex-wrap: wrap; font-size: 1.125rem; color: #c7d2fe; margin-bottom: 3rem;">
        <div style="text-align: center;">
          <p style="color: #fbbf24; font-size: 2.5rem; margin-bottom: 0.5rem;">📅</p>
          <p style="margin: 0; font-weight: 600;">Saturday, March 20, 2025</p>
          <p style="margin: 0; opacity: 0.8; font-size: 1rem;">7:00 PM - 12:00 AM</p>
        </div>
        <div style="width: 2px; height: 60px; background: rgba(199, 210, 254, 0.3);"></div>
        <div style="text-align: center;">
          <p style="color: #fbbf24; font-size: 2.5rem; margin-bottom: 0.5rem;">📍</p>
          <p style="margin: 0; font-weight: 600;">The Grand Ballroom</p>
          <p style="margin: 0; opacity: 0.8; font-size: 1rem;">Royal Plaza Hotel</p>
        </div>
        <div style="width: 2px; height: 60px; background: rgba(199, 210, 254, 0.3);"></div>
        <div style="text-align: center;">
          <p style="color: #fbbf24; font-size: 2.5rem; margin-bottom: 0.5rem;">👔</p>
          <p style="margin: 0; font-weight: 600;">Dress Code</p>
          <p style="margin: 0; opacity: 0.8; font-size: 1rem;">Black Tie</p>
        </div>
      </div>
      
      <div style="display: inline-flex; gap: 2rem; margin-top: 2rem;">
        <a href="#" style="display: inline-block; background: linear-gradient(135deg, #fbbf24, #f59e0b); color: #1e1b4b; padding: 1.25rem 3rem; border-radius: 0.5rem; font-weight: 800; text-decoration: none; font-size: 1.125rem; box-shadow: 0 10px 40px rgba(251, 191, 36, 0.4); text-transform: uppercase; letter-spacing: 0.05em;">Reserve Your Seat</a>
        <a href="#" style="display: inline-block; background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border: 2px solid rgba(255,255,255,0.3); color: white; padding: 1.25rem 3rem; border-radius: 0.5rem; font-weight: 700; text-decoration: none; text-transform: uppercase; letter-spacing: 0.05em;">View Program</a>
      </div>
    </div>
  </div>
  
  <div style="max-width: 1400px; margin: 0 auto; padding: 6rem 3rem;">
    <div style="text-align: center; margin-bottom: 5rem;">
      <p style="color: #fbbf24; font-size: 1rem; font-weight: 700; letter-spacing: 0.15rem; margin-bottom: 1rem; text-transform: uppercase;">A Night to Remember</p>

      <h2 style="font-size: 3.5rem; font-weight: 900; margin-bottom: 2rem; color: white; letter-spacing: -0.02em;">Evening Program</h2>
      <p style="font-size: 1.25rem; color: #c7d2fe; line-height: 1.5; max-width: 900px; margin: 0 auto;">Join us for an unforgettable evening of elegance, celebration, and recognition as we honor the outstanding achievements of our team and partners</p>
    </div>
    
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 3rem; margin-bottom: 6rem;">
      <div style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(99, 102, 241, 0.1)); border: 1px solid rgba(139, 92, 246, 0.3); padding: 3rem; border-radius: 1rem; backdrop-filter: blur(10px);">
        <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #8b5cf6, #6366f1); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; margin-bottom: 2rem; box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);">🍾</div>
        <h3 style="color: #c7d2fe; font-size: 1.125rem; font-weight: 700; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">7:00 PM</h3>
        <h4 style="color: white; font-size: 1.75rem; font-weight: 800; margin-bottom: 1rem;">Cocktail Reception</h4>
        <p style="color: #a5b4fc; font-size: 1.125rem; line-height: 1.7; margin: 0;">Welcome drinks and canapés in the Grand Foyer. Network with colleagues and partners while enjoying live piano music.</p>
      </div>
      
      <div style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(99, 102, 241, 0.1)); border: 1px solid rgba(139, 92, 246, 0.3); padding: 3rem; border-radius: 1rem; backdrop-filter: blur(10px);">
        <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #8b5cf6, #6366f1); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; margin-bottom: 2rem; box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);">🍽️</div>
        <h3 style="color: #c7d2fe; font-size: 1.125rem; font-weight: 700; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">8:00 PM</h3>
        <h4 style="color: white; font-size: 1.75rem; font-weight: 800; margin-bottom: 1rem;">Dinner Service</h4>
        <p style="color: #a5b4fc; font-size: 1.125rem; line-height: 1.7; margin: 0;">Five-course gourmet dinner prepared by award-winning Chef Marco Rossi, paired with premium wines selected by our sommelier.</p>
      </div>
      
      <div style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(99, 102, 241, 0.1)); border: 1px solid rgba(139, 92, 246, 0.3); padding: 3rem; border-radius: 1rem; backdrop-filter: blur(10px);">
        <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #8b5cf6, #6366f1); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; margin-bottom: 2rem; box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);">🏆</div>
        <h3 style="color: #c7d2fe; font-size: 1.125rem; font-weight: 700; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">9:30 PM</h3>
        <h4 style="color: white; font-size: 1.75rem; font-weight: 800; margin-bottom: 1rem;">Awards Ceremony</h4>
        <p style="color: #a5b4fc; font-size: 1.125rem; line-height: 1.7; margin: 0;">Recognition of outstanding achievements across 12 categories, celebrating the excellence and dedication of our team members.</p>
      </div>
      
      <div style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(99, 102, 241, 0.1)); border: 1px solid rgba(139, 92, 246, 0.3); padding: 3rem; border-radius: 1rem; backdrop-filter: blur(10px);">
        <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #8b5cf6, #6366f1); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; margin-bottom: 2rem; box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);">🎤</div>
        <h3 style="color: #c7d2fe; font-size: 1.125rem; font-weight: 700; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">10:30 PM</h3>
        <h4 style="color: white; font-size: 1.75rem; font-weight: 800; margin-bottom: 1rem;">Keynote Address</h4>
        <p style="color: #a5b4fc; font-size: 1.125rem; line-height: 1.7; margin: 0;">Inspiring words from our CEO on vision, achievements, and the exciting opportunities ahead for our organization.</p>
      </div>
      
      <div style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(99, 102, 241, 0.1)); border: 1px solid rgba(139, 92, 246, 0.3); padding: 3rem; border-radius: 1rem; backdrop-filter: blur(10px);">
        <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #8b5cf6, #6366f1); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; margin-bottom: 2rem; box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);">🎵</div>
        <h3 style="color: #c7d2fe; font-size: 1.125rem; font-weight: 700; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">11:00 PM</h3>
        <h4 style="color: white; font-size: 1.75rem; font-weight: 800; margin-bottom: 1rem;">Live Entertainment</h4>
        <p style="color: #a5b4fc; font-size: 1.125rem; line-height: 1.7; margin: 0;">Performance by internationally renowned jazz ensemble "The Blue Notes," followed by dancing with DJ Platinum spinning classics and contemporary hits.</p>
      </div>
      
      <div style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(99, 102, 241, 0.1)); border: 1px solid rgba(139, 92, 246, 0.3); padding: 3rem; border-radius: 1rem; backdrop-filter: blur(10px);">
        <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #8b5cf6, #6366f1); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; margin-bottom: 2rem; box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);">🌙</div>
        <h3 style="color: #c7d2fe; font-size: 1.125rem; font-weight: 700; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">12:00 AM</h3>
        <h4 style="color: white; font-size: 1.75rem; font-weight: 800; margin-bottom: 1rem;">Midnight Finale</h4>
        <p style="color: #a5b4fc; font-size: 1.125rem; line-height: 1.7; margin: 0;">A spectacular close to the evening with champagne toast and farewell as we look forward to another year of success together.</p>
      </div>
    </div>
    
    <div style="background: linear-gradient(135deg, #fbbf24, #f59e0b); padding: 5rem 4rem; border-radius: 2rem; margin: 6rem 0; box-shadow: 0 30px 80px rgba(251, 191, 36, 0.3);">
      <h2 style="color: #1e1b4b; font-size: 3rem; font-weight: 900; margin-bottom: 2rem;">Award Categories</h2>
      <p style="color: #78350f; font-size: 1.25rem; margin-bottom: 4rem; max-width: 800px; margin-left: auto; margin-right: auto; line-height: 1.7;">Celebrating excellence across our organization</p>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; text-align: left;">
        <div style="background: rgba(255,255,255,0.95); padding: 2rem; border-radius: 1rem; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
          <p style="color: #fbbf24; font-size: 2rem; margin-bottom: 1rem;">🌟</p>
          <h4 style="color: #1e1b4b; font-size: 1.25rem; font-weight: 800; margin-bottom: 0.75rem;">Leadership Excellence</h4>
          <p style="color: #475569; font-size: 1rem; line-height: 1.6; margin: 0;">Recognizing visionary leaders who inspire teams and drive organizational success</p>
        </div>
        
        <div style="background: rgba(255,255,255,0.95); padding: 2rem; border-radius: 1rem; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
          <p style="color: #fbbf24; font-size: 2rem; margin-bottom: 1rem;">💡</p>
          <h4 style="color: #1e1b4b; font-size: 1.25rem; font-weight: 800; margin-bottom: 0.75rem;">Innovation Award</h4>
          <p style="color: #475569; font-size: 1rem; line-height: 1.6; margin: 0;">Honoring groundbreaking ideas and creative solutions that transform our business</p>
        </div>
        
        <div style="background: rgba(255,255,255,0.95); padding: 2rem; border-radius: 1rem; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
          <p style="color: #fbbf24; font-size: 2rem; margin-bottom: 1rem;">🤝</p>
          <h4 style="color: #1e1b4b; font-size: 1.25rem; font-weight: 800; margin-bottom: 0.75rem;">Team Collaboration</h4>
          <p style="color: #475569; font-size: 1rem; line-height: 1.6; margin: 0;">Celebrating teams that exemplify cooperation, synergy, and collective achievement</p>
        </div>
        
        <div style="background: rgba(255,255,255,0.95); padding: 2rem; border-radius: 1rem; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
          <p style="color: #fbbf24; font-size: 2rem; margin-bottom: 1rem;">🚀</p>
          <h4 style="color: #1e1b4b; font-size: 1.25rem; font-weight: 800; margin-bottom: 0.75rem;">Rising Star</h4>
          <p style="color: #475569; font-size: 1rem; line-height: 1.6; margin: 0;">Recognizing emerging talent demonstrating exceptional potential and impact</p>
        </div>
        
        <div style="background: rgba(255,255,255,0.95); padding: 2rem; border-radius: 1rem; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
          <p style="color: #fbbf24; font-size: 2rem; margin-bottom: 1rem;">❤️</p>
          <h4 style="color: #1e1b4b; font-size: 1.25rem; font-weight: 800; margin-bottom: 0.75rem;">Culture Champion</h4>
          <p style="color: #475569; font-size: 1rem; line-height: 1.6; margin: 0;">Honoring those who embody our values and foster positive workplace culture</p>
        </div>
        
        <div style="background: rgba(255,255,255,0.95); padding: 2rem; border-radius: 1rem; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
          <p style="color: #fbbf24; font-size: 2rem; margin-bottom: 1rem;">🎯</p>
          <h4 style="color: #1e1b4b; font-size: 1.25rem; font-weight: 800; margin-bottom: 0.75rem;">Performance Excellence</h4>
          <p style="color: #475569; font-size: 1rem; line-height: 1.6; margin: 0;">Celebrating outstanding results and exceptional achievement of business objectives</p>
        </div>
      </div>
    </div>
    
    <div style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(99, 102, 241, 0.15)); border: 2px solid rgba(139, 92, 246, 0.3); padding: 4rem; border-radius: 1.5rem; margin: 6rem 0;">
      <h2 style="color: white; font-size: 2.5rem; font-weight: 900; margin-bottom: 3rem; text-align: center;">Important Information</h2>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 3rem;">
        <div>
          <h4 style="color: #fbbf24; font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.75rem;"><span>🅿️</span> Parking & Transportation</h4>
          <p style="color: #c7d2fe; font-size: 1rem; line-height: 1.7; margin: 0;">Complimentary valet parking available. Shuttle service provided from main office locations. Ride-share drop-off zone at main entrance.</p>
        </div>
        
        <div>
          <h4 style="color: #fbbf24; font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.75rem;"><span>🏨</span> Accommodation</h4>
          <p style="color: #c7d2fe; font-size: 1rem; line-height: 1.7; margin: 0;">Special rates available at Royal Plaza Hotel. Quote "Excellence Awards 2025" when booking. Limited rooms available—book early!</p>
        </div>
        
        <div>
          <h4 style="color: #fbbf24; font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.75rem;"><span>🍽️</span> Dietary Requirements</h4>
          <p style="color: #c7d2fe; font-size: 1rem; line-height: 1.7; margin: 0;">Please inform us of any dietary restrictions or allergies during registration. Vegetarian, vegan, gluten-free, and halal options available.</p>
        </div>
        
        <div>
          <h4 style="color: #fbbf24; font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.75rem;"><span>📸</span> Photography</h4>
          <p style="color: #c7d2fe; font-size: 1rem; line-height: 1.7; margin: 0;">Professional photographer present. Digital photo booth available. Photos will be shared via company portal within one week of the event.</p>
        </div>
        
        <div>
          <h4 style="color: #fbbf24; font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.75rem;"><span>🎁</span> Plus One Policy</h4>
          <p style="color: #c7d2fe; font-size: 1rem; line-height: 1.7; margin: 0;">All employees welcome to bring a guest. Please register your plus-one by March 10th to ensure proper seating arrangements.</p>
        </div>
        
        <div>
          <h4 style="color: #fbbf24; font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.75rem;"><span>📞</span> Contact</h4>
          <p style="color: #c7d2fe; font-size: 1rem; line-height: 1.7; margin: 0;">Questions? Contact Events Team at events@company.com or ext. 5500. We're here to ensure your evening is perfect!</p>
        </div>
      </div>
    </div>
    
    <div style="text-align: center; padding: 4rem 2rem; background: linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.1)); border-radius: 1.5rem; margin-top: 6rem;">
      <h3 style="color: white; font-size: 2.5rem; font-weight: 900; margin-bottom: 1.5rem;">Secure Your Seat Today</h3>
      <p style="color: #c7d2fe; font-size: 1.25rem; line-height: 1.7; margin-bottom: 3rem; max-width: 700px; margin-left: auto; margin-right: auto;">Confirm your attendance by March 10th to guarantee your place at this unforgettable celebration.</p>
      <a href="#" style="display: inline-block; background: linear-gradient(135deg, #fbbf24, #f59e0b); color: #1e1b4b; padding: 1.5rem 4rem; border-radius: 0.75rem; font-weight: 800; text-decoration: none; font-size: 1.25rem; box-shadow: 0 15px 50px rgba(251, 191, 36, 0.4); text-transform: uppercase; letter-spacing: 0.05em;">RSVP Now</a>
    </div>
  </div>
</div>
    `,
  },
  {
    id: "corporate-team-building",
    name: "Team Building Event",
    description: "Fun, energetic design for team building activities and company retreats",
    category: "corporate-event",
    preview: "🎯",
    html: `
<div style="font-family: 'Inter', sans-serif; background: linear-gradient(to bottom, #fef3c7, #fef9e7, #fff7ed); color: #0f172a; padding: 0;">
  <div style="background: linear-gradient(135deg, #f59e0b 0%, #fb923c 50%, #f97316 100%); padding: 5rem 3rem; position: relative; overflow: hidden;">
    <div style="position: absolute; top: -50%; right: -10%; width: 600px; height: 600px; background: rgba(255,255,255,0.1); border-radius: 50%; filter: blur(80px);"></div>
    <div style="position: absolute; bottom: -30%; left: -5%; width: 400px; height: 400px; background: rgba(255,255,255,0.15); border-radius: 50%; filter: blur(60px);"></div>
    
    <div style="position: relative; z-index: 10; max-width: 1200px; margin: 0 auto;">
      <div style="display: inline-block; background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); padding: 0.75rem 2rem; border-radius: 2rem; margin-bottom: 2rem; border: 2px solid rgba(255,255,255,0.3);">
        <p style="color: white; font-size: 0.875rem; font-weight: 700; letter-spacing: 0.1rem; margin: 0; text-transform: uppercase;">🎯 Team Building Experience</p>
      </div>
      
      <h1 style="font-size: 4.5rem; font-weight: 900; line-height: 1.1; margin-bottom: 2rem; color: white; text-shadow: 0 4px 20px rgba(0,0,0,0.2); letter-spacing: -0.03em;">Summer Team Retreat 2025</h1>
      
      <p style="font-size: 1.75rem; line-height: 1.6; color: rgba(255,255,255,0.95); margin-bottom: 3rem; font-weight: 400; max-width: 850px; margin-left: auto; margin-right: auto; text-shadow: 0 2px 10px rgba(0,0,0,0.2);">Join us for an unforgettable day of connection, collaboration, and celebration as we strengthen our team bonds through exciting activities and shared experiences</p>
      
      <div style="display: flex; gap: 2rem; flex-wrap: wrap; align-items: center; margin-bottom: 3rem;">
        <div style="background: white; padding: 1.5rem 2.5rem; border-radius: 1rem; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
          <p style="color: #f59e0b; font-size: 0.875rem; font-weight: 700; margin-bottom: 0.5rem; text-transform: uppercase;">Date</p>
          <p style="color: #0f172a; font-size: 1.5rem; font-weight: 800; margin: 0;">June 15, 2025</p>
        </div>
        <div style="background: white; padding: 1.5rem 2.5rem; border-radius: 1rem; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
          <p style="color: #f59e0b; font-size: 0.875rem; font-weight: 700; margin-bottom: 0.5rem; text-transform: uppercase;">Time</p>
          <p style="color: #0f172a; font-size: 1.5rem; font-weight: 800; margin: 0;">9:00 AM - 5:00 PM</p>
        </div>
        <div style="background: white; padding: 1.5rem 2.5rem; border-radius: 1rem; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
          <p style="color: #f59e0b; font-size: 0.875rem; font-weight: 700; margin-bottom: 0.5rem; text-transform: uppercase;">Location</p>
          <p style="color: #0f172a; font-size: 1.5rem; font-weight: 800; margin: 0;">Mountain View Resort</p>
        </div>
      </div>
      
      <a href="#" style="display: inline-block; background: white; color: #f59e0b; padding: 1.25rem 3rem; border-radius: 1rem; font-weight: 800; text-decoration: none; font-size: 1.125rem; box-shadow: 0 10px 30px rgba(0,0,0,0.3); text-transform: uppercase; letter-spacing: 0.05em;">Confirm Attendance</a>
    </div>
  </div>
  
  <div style="max-width: 1300px; margin: 0 auto; padding: 6rem 3rem;">
    <div style="text-align: center; margin-bottom: 5rem;">
      <h2 style="font-size: 3.5rem; font-weight: 800; color: #0f172a; margin-bottom: 1.5rem; line-height: 1.2;">A Day of Adventure & Connection</h2>
      <p style="font-size: 1.375rem; color: #64748b; max-width: 800px; margin: 0 auto; line-height: 1.7;">Experience exciting challenges, build lasting memories, and strengthen relationships in a beautiful outdoor setting</p>
    </div>
    
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 3rem; margin-bottom: 6rem;">
      <div style="background: white; padding: 3rem; border-radius: 1.5rem; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border-left: 5px solid #f59e0b;">
        <div style="font-size: 3rem; margin-bottom: 1.5rem;">🏃</div>
        <h3 style="font-size: 1.75rem; font-weight: 700; color: #0f172a; margin-bottom: 1rem;">Outdoor Challenges</h3>
        <p style="font-size: 1.125rem; color: #64748b; line-height: 1.7; margin-bottom: 1.5rem;">Team-based obstacle courses, treasure hunts, and problem-solving activities designed to build trust and collaboration</p>
        <ul style="list-style: none; padding: 0; margin: 0;">
          <li style="padding: 0.75rem 0; border-bottom: 1px solid #f1f5f9; color: #475569; font-size: 1.0625rem;">✓ Rope courses & zip-lining</li>
          <li style="padding: 0.75rem 0; border-bottom: 1px solid #f1f5f9; color: #475569; font-size: 1.0625rem;">✓ Team scavenger hunt</li>
          <li style="padding: 0.75rem 0; color: #475569; font-size: 1.0625rem;">✓ Problem-solving challenges</li>
        </ul>
      </div>
      
      <div style="background: white; padding: 3rem; border-radius: 1.5rem; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border-left: 5px solid #fb923c;">
        <div style="font-size: 3rem; margin-bottom: 1.5rem;">🎨</div>
        <h3 style="font-size: 1.75rem; font-weight: 700; color: #0f172a; margin-bottom: 1rem;">Creative Workshops</h3>
        <p style="font-size: 1.125rem; color: #64748b; line-height: 1.7; margin-bottom: 1.5rem;">Express yourselves through art, music, and collaborative creation projects that bring out everyone's unique talents</p>
        <ul style="list-style: none; padding: 0; margin: 0;">
          <li style="padding: 0.75rem 0; border-bottom: 1px solid #f1f5f9; color: #475569; font-size: 1.0625rem;">✓ Team mural painting</li>
          <li style="padding: 0.75rem 0; border-bottom: 1px solid #f1f5f9; color: #475569; font-size: 1.0625rem;">✓ Improvisation games</li>
          <li style="padding: 0.75rem 0; color: #475569; font-size: 1.0625rem;">✓ Collaborative storytelling</li>
        </ul>
      </div>
      
      <div style="background: white; padding: 3rem; border-radius: 1.5rem; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border-left: 5px solid #f97316;">
        <div style="font-size: 3rem; margin-bottom: 1.5rem;">🍽️</div>
        <h3 style="font-size: 1.75rem; font-weight: 700; color: #0f172a; margin-bottom: 1rem;">Gourmet Experience</h3>
        <p style="font-size: 1.125rem; color: #64748b; line-height: 1.7; margin-bottom: 1.5rem;">Enjoy delicious meals prepared by award-winning chefs, with options for all dietary preferences and requirements</p>
        <ul style="list-style: none; padding: 0; margin: 0;">
          <li style="padding: 0.75rem 0; border-bottom: 1px solid #f1f5f9; color: #475569; font-size: 1.0625rem;">✓ Welcome breakfast buffet</li>
          <li style="padding: 0.75rem 0; border-bottom: 1px solid #f1f5f9; color: #475569; font-size: 1.0625rem;">✓ BBQ lunch outdoors</li>
          <li style="padding: 0.75rem 0; color: #475569; font-size: 1.0625rem;">✓ Evening celebration dinner</li>
        </ul>
      </div>
    </div>
    
    <div style="background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%); padding: 5rem; border-radius: 2rem; margin-bottom: 6rem; position: relative; overflow: hidden;">
      <div style="position: absolute; top: -50px; right: -50px; width: 300px; height: 300px; background: rgba(251, 146, 60, 0.2); border-radius: 50%; filter: blur(80px);"></div>
      <div style="position: relative; z-index: 10;">
        <h2 style="font-size: 3rem; font-weight: 800; color: #0f172a; margin-bottom: 2rem; text-align: center;">Event Schedule</h2>
        
        <div style="display: grid; gap: 2rem; max-width: 900px; margin: 0 auto;">
          <div style="display: flex; gap: 2rem; align-items: start;">
            <div style="background: #f59e0b; color: white; padding: 1rem 1.5rem; border-radius: 1rem; font-weight: 800; font-size: 1.25rem; min-width: 120px; text-align: center;">9:00 AM</div>
            <div style="flex: 1;">
              <h4 style="font-size: 1.5rem; font-weight: 700; color: #0f172a; margin-bottom: 0.5rem;">Welcome & Breakfast</h4>
              <p style="color: #64748b; font-size: 1.125rem; line-height: 1.6;">Arrive, check in, and enjoy a delicious breakfast buffet while mingling with colleagues</p>
            </div>
          </div>
          
          <div style="display: flex; gap: 2rem; align-items: start;">
            <div style="background: #fb923c; color: white; padding: 1rem 1.5rem; border-radius: 1rem; font-weight: 800; font-size: 1.25rem; min-width: 120px; text-align: center;">10:30 AM</div>
            <div style="flex: 1;">
              <h4 style="font-size: 1.5rem; font-weight: 700; color: #0f172a; margin-bottom: 0.5rem;">Team Building Activities</h4>
              <p style="color: #64748b; font-size: 1.125rem; line-height: 1.6;">Participate in exciting outdoor challenges and problem-solving activities</p>
            </div>
          </div>
          
          <div style="display: flex; gap: 2rem; align-items: start;">
            <div style="background: #f97316; color: white; padding: 1rem 1.5rem; border-radius: 1rem; font-weight: 800; font-size: 1.25rem; min-width: 120px; text-align: center;">1:00 PM</div>
            <div style="flex: 1;">
              <h4 style="font-size: 1.5rem; font-weight: 700; color: #0f172a; margin-bottom: 0.5rem;">BBQ Lunch</h4>
              <p style="color: #64748b; font-size: 1.125rem; line-height: 1.6;">Relax and refuel with a delicious outdoor BBQ lunch</p>
            </div>
          </div>
          
          <div style="display: flex; gap: 2rem; align-items: start;">
            <div style="background: #ea580c; color: white; padding: 1rem 1.5rem; border-radius: 1rem; font-weight: 800; font-size: 1.25rem; min-width: 120px; text-align: center;">2:30 PM</div>
            <div style="flex: 1;">
              <h4 style="font-size: 1.5rem; font-weight: 700; color: #0f172a; margin-bottom: 0.5rem;">Creative Workshops</h4>
              <p style="color: #64748b; font-size: 1.125rem; line-height: 1.6;">Unleash your creativity through art, music, and collaborative projects</p>
            </div>
          </div>
          
          <div style="display: flex; gap: 2rem; align-items: start;">
            <div style="background: #c2410c; color: white; padding: 1rem 1.5rem; border-radius: 1rem; font-weight: 800; font-size: 1.25rem; min-width: 120px; text-align: center;">5:00 PM</div>
            <div style="flex: 1;">
              <h4 style="font-size: 1.5rem; font-weight: 700; color: #0f172a; margin-bottom: 0.5rem;">Celebration Dinner & Awards</h4>
              <p style="color: #64748b; font-size: 1.125rem; line-height: 1.6;">End the day with a special dinner and recognition ceremony</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div style="text-align: center; background: white; padding: 5rem 3rem; border-radius: 2rem; box-shadow: 0 10px 40px rgba(0,0,0,0.1);">
      <h2 style="font-size: 3rem; font-weight: 800; color: #0f172a; margin-bottom: 1.5rem;">What to Bring</h2>
      <p style="font-size: 1.25rem; color: #64748b; margin-bottom: 3rem; max-width: 700px; margin-left: auto; margin-right: auto;">Come prepared for a day of outdoor fun and adventure</p>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; max-width: 1000px; margin: 0 auto;">
        <div style="padding: 2rem; background: #fef3c7; border-radius: 1rem;">
          <div style="font-size: 2.5rem; margin-bottom: 1rem;">👟</div>
          <p style="font-weight: 700; color: #0f172a; font-size: 1.125rem;">Comfortable Shoes</p>
        </div>
        <div style="padding: 2rem; background: #fed7aa; border-radius: 1rem;">
          <div style="font-size: 2.5rem; margin-bottom: 1rem;">🧢</div>
          <p style="font-weight: 700; color: #0f172a; font-size: 1.125rem;">Sun Protection</p>
        </div>
        <div style="padding: 2rem; background: #fef3c7; border-radius: 1rem;">
          <div style="font-size: 2.5rem; margin-bottom: 1rem;">💧</div>
          <p style="font-weight: 700; color: #0f172a; font-size: 1.125rem;">Water Bottle</p>
        </div>
        <div style="padding: 2rem; background: #fed7aa; border-radius: 1rem;">
          <div style="font-size: 2.5rem; margin-bottom: 1rem;">😊</div>
          <p style="font-weight: 700; color: #0f172a; font-size: 1.125rem;">Positive Energy</p>
        </div>
      </div>
    </div>
  </div>
  
  <div style="background: linear-gradient(135deg, #f59e0b 0%, #ec4899 50%, #8b5cf6 100%); padding: 5rem 3rem; text-align: center;">
    <h2 style="font-size: 3rem; font-weight: 800; color: white; margin-bottom: 2rem;">Ready for an Amazing Day?</h2>
    <p style="font-size: 1.375rem; color: rgba(255,255,255,0.95); margin-bottom: 3rem; max-width: 700px; margin-left: auto; margin-right: auto;">Confirm your attendance by June 1st to secure your spot</p>
    <a href="#" style="display: inline-block; background: white; color: #f59e0b; padding: 1.5rem 3.5rem; border-radius: 1rem; font-weight: 800; text-decoration: none; font-size: 1.25rem; box-shadow: 0 10px 30px rgba(0,0,0,0.3); text-transform: uppercase; letter-spacing: 0.05em;">Confirm Attendance Now</a>
  </div>
</div>
    `,
  }
]

export const templates = blogTemplates
