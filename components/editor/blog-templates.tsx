export interface BlogTemplate {
  id: string
  name: string
  description: string
  preview: string
  category: "professional" | "creative" | "minimal" | "vibrant" | "tech" | "editorial"
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
<div style="max-width: 800px; margin: 0 auto; font-family: 'Inter', sans-serif; color: #1e293b;">
  <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 60px 40px; border-radius: 12px; margin-bottom: 40px;">
    <p style="color: #93c5fd; text-transform: uppercase; font-size: 14px; font-weight: 600; letter-spacing: 2px; margin-bottom: 16px;">HR INSIGHTS</p>
    <h1 style="color: white; font-size: 42px; font-weight: 800; line-height: 1.2; margin-bottom: 16px;">Your Professional Title Here</h1>
    <p style="color: #dbeafe; font-size: 18px; line-height: 1.6;">A compelling subtitle that draws readers in and explains what this article is about</p>
  </div>
  
  <div style="padding: 0 40px;">
    <p style="font-size: 18px; line-height: 1.8; color: #475569; margin-bottom: 24px;">Start writing your professional content here. This template is designed for corporate communications, policy updates, and formal HR announcements.</p>
    
    <h2 style="color: #1e40af; font-size: 32px; font-weight: 700; margin-top: 48px; margin-bottom: 24px;">Key Sections</h2>
    <p style="font-size: 18px; line-height: 1.8; color: #475569; margin-bottom: 24px;">Organize your content with clear, professional sections that guide readers through your message.</p>
    
    <div style="background: #f1f5f9; padding: 32px; border-left: 4px solid #3b82f6; border-radius: 8px; margin: 32px 0;">
      <p style="font-size: 16px; line-height: 1.6; color: #475569; margin: 0;"><strong>Pro Tip:</strong> Use callout boxes like this to highlight important information or key takeaways.</p>
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
  <div style="background: linear-gradient(135deg, #ec4899 0%, #f59e0b 50%, #8b5cf6 100%); padding: 80px 40px; position: relative; overflow: hidden;">
    <div style="position: relative; z-index: 10; max-width: 800px; margin: 0 auto;">
      <span style="display: inline-block; background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; margin-bottom: 20px;">✨ FEATURED</span>
      <h1 style="color: white; font-size: 56px; font-weight: 900; line-height: 1.1; margin-bottom: 20px; text-shadow: 0 2px 20px rgba(0,0,0,0.2);">Creative Title That Pops</h1>
      <p style="color: rgba(255,255,255,0.95); font-size: 20px; line-height: 1.6;">Break the mold with bold ideas and innovative approaches to HR</p>
    </div>
  </div>
  
  <div style="max-width: 900px; margin: -40px auto 0; padding: 0 40px;">
    <div style="background: white; padding: 60px; border-radius: 24px; box-shadow: 0 20px 60px rgba(0,0,0,0.1);">
      <p style="font-size: 20px; line-height: 1.8; color: #334155; margin-bottom: 32px;">Start with an engaging opening that captures attention. This template is perfect for creative HR initiatives, culture stories, and innovative workplace practices.</p>
      
      <h2 style="background: linear-gradient(135deg, #ec4899, #f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 36px; font-weight: 800; margin-top: 48px; margin-bottom: 24px;">Sections That Stand Out</h2>
      <p style="font-size: 18px; line-height: 1.8; color: #475569; margin-bottom: 32px;">Keep your content dynamic and visually interesting with vibrant sections.</p>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px; margin: 40px 0;">
        <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); padding: 32px; border-radius: 16px;">
          <h3 style="color: #92400e; font-size: 20px; font-weight: 700; margin-bottom: 12px;">💡 Innovation</h3>
          <p style="color: #78350f; line-height: 1.6; margin: 0;">Fresh ideas for modern workplaces</p>
        </div>
        <div style="background: linear-gradient(135deg, #ddd6fe, #c4b5fd); padding: 32px; border-radius: 16px;">
          <h3 style="color: #5b21b6; font-size: 20px; font-weight: 700; margin-bottom: 12px;">🚀 Growth</h3>
          <p style="color: #6b21a8; line-height: 1.6; margin: 0;">Strategies that drive success</p>
        </div>
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
<div style="max-width: 700px; margin: 0 auto; font-family: 'Georgia', serif; color: #18181b; padding: 80px 40px;">
  <div style="text-align: center; margin-bottom: 80px;">
    <p style="color: #71717a; text-transform: uppercase; font-size: 12px; font-weight: 600; letter-spacing: 3px; margin-bottom: 24px; font-family: 'Inter', sans-serif;">THOUGHT LEADERSHIP</p>
    <h1 style="font-size: 48px; font-weight: 400; line-height: 1.2; margin-bottom: 24px; letter-spacing: -1px;">Elegant Title With Impact</h1>
    <p style="color: #52525b; font-size: 18px; line-height: 1.6; font-style: italic;">A thoughtful subtitle that sets the tone for your content</p>
    <div style="width: 60px; height: 2px; background: #18181b; margin: 40px auto 0;"></div>
  </div>
  
  <div style="font-size: 19px; line-height: 1.9; color: #3f3f46;">
    <p style="margin-bottom: 28px; text-indent: 2em;">Begin your narrative with elegant prose. This template emphasizes readability and timeless design, perfect for in-depth articles, thought leadership, and reflective pieces on HR trends.</p>
    
    <h2 style="font-size: 32px; font-weight: 400; margin-top: 64px; margin-bottom: 24px; letter-spacing: -0.5px;">The Power of Simplicity</h2>
    <p style="margin-bottom: 28px;">Let your words take center stage. Minimalist design removes distractions and focuses attention on your message.</p>
    
    <blockquote style="border-left: 3px solid #18181b; padding-left: 32px; margin: 48px 0; font-style: italic; color: #52525b; font-size: 22px; line-height: 1.7;">
      "Excellence is achieved by the mastery of fundamentals." <br/>
      <span style="font-size: 16px; font-style: normal; color: #71717a; margin-top: 12px; display: block;">— HR Leader</span>
    </blockquote>
  </div>
</div>
    `,
  },
  {
    id: "vibrant-event",
    name: "Vibrant Event",
    description: "Energetic, colorful design perfect for event announcements and HR celebrations",
    category: "vibrant",
    preview: "🎉",
    html: `
<div style="font-family: 'Inter', sans-serif; background: linear-gradient(180deg, #fef3c7 0%, #fde68a 30%, #fbbf24 100%); padding: 60px 40px;">
  <div style="max-width: 900px; margin: 0 auto;">
    <div style="text-align: center; margin-bottom: 48px;">
      <span style="display: inline-block; background: white; color: #f59e0b; padding: 12px 24px; border-radius: 30px; font-size: 16px; font-weight: 700; margin-bottom: 24px; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);">🎊 SPECIAL ANNOUNCEMENT</span>
      <h1 style="color: #78350f; font-size: 52px; font-weight: 900; line-height: 1.1; margin-bottom: 20px; text-transform: uppercase; letter-spacing: -1px;">Exciting HR Event!</h1>
      <p style="color: #92400e; font-size: 22px; font-weight: 600; line-height: 1.5;">Join us for an unforgettable experience</p>
    </div>
    
    <div style="background: white; padding: 48px; border-radius: 24px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); margin-bottom: 32px;">
      <p style="font-size: 20px; line-height: 1.8; color: #334155; margin-bottom: 32px;">Get ready for something amazing! This template is designed for event announcements, celebrations, and energetic HR communications that need to stand out.</p>
      
      <div style="background: linear-gradient(135deg, #fed7aa, #fdba74); padding: 40px; border-radius: 20px; margin: 32px 0;">
        <h2 style="color: #7c2d12; font-size: 32px; font-weight: 800; margin-bottom: 20px;">📅 Event Highlights</h2>
        <ul style="list-style: none; padding: 0; margin: 0;">
          <li style="color: #9a3412; font-size: 18px; margin-bottom: 16px; padding-left: 28px; position: relative;">
            <span style="position: absolute; left: 0; top: 0;">✨</span> Interactive sessions with industry leaders
          </li>
          <li style="color: #9a3412; font-size: 18px; margin-bottom: 16px; padding-left: 28px; position: relative;">
            <span style="position: absolute; left: 0; top: 0;">🎯</span> Networking opportunities
          </li>
          <li style="color: #9a3412; font-size: 18px; padding-left: 28px; position: relative;">
            <span style="position: absolute; left: 0; top: 0;">🏆</span> Awards and recognition
          </li>
        </ul>
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
<div style="background: #0f172a; color: white; font-family: 'Inter', sans-serif; padding: 60px 40px;">
  <div style="max-width: 900px; margin: 0 auto;">
    <div style="background: linear-gradient(135deg, #1e293b, #334155); padding: 60px; border-radius: 20px; border: 1px solid #334155; margin-bottom: 40px; position: relative; overflow: hidden;">
      <div style="position: absolute; top: 0; right: 0; width: 300px; height: 300px; background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%); border-radius: 50%;"></div>
      <div style="position: relative; z-index: 10;">
        <p style="color: #60a5fa; text-transform: uppercase; font-size: 14px; font-weight: 700; letter-spacing: 2px; margin-bottom: 16px;">FUTURE OF WORK</p>
        <h1 style="font-size: 48px; font-weight: 900; line-height: 1.1; margin-bottom: 16px; background: linear-gradient(135deg, #ffffff, #93c5fd); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Digital Transformation in HR</h1>
        <p style="color: #cbd5e1; font-size: 18px; line-height: 1.6;">Exploring the intersection of technology and human resources</p>
      </div>
    </div>
    
    <div style="background: #1e293b; padding: 48px; border-radius: 16px; border: 1px solid #334155;">
      <p style="font-size: 18px; line-height: 1.8; color: #cbd5e1; margin-bottom: 32px;">Dive into the future of HR technology. This template is perfect for discussing digital tools, automation, AI in HR, and technological innovations in the workplace.</p>
      
      <h2 style="color: #60a5fa; font-size: 32px; font-weight: 800; margin-top: 48px; margin-bottom: 24px; font-family: monospace;">&lt;Innovation /&gt;</h2>
      <p style="font-size: 18px; line-height: 1.8; color: #cbd5e1; margin-bottom: 32px;">Explore cutting-edge solutions and emerging trends in HR technology.</p>
      
      <div style="background: linear-gradient(135deg, #1e3a8a, #3b82f6); padding: 32px; border-radius: 12px; margin: 32px 0; border: 1px solid #3b82f6;">
        <p style="font-size: 16px; line-height: 1.6; color: #dbeafe; margin: 0; font-family: monospace;"><strong>→ Key Insight:</strong> Technology should enhance, not replace, the human element in HR</p>
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
<div style="max-width: 800px; margin: 0 auto; font-family: 'Georgia', serif; padding: 60px 40px;">
  <div style="border-top: 4px solid #18181b; border-bottom: 4px solid #18181b; padding: 32px 0; margin-bottom: 48px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; font-family: 'Inter', sans-serif; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #71717a;">
      <span>HR MARKET MAGAZINE</span>
      <span>VOLUME 1 • ISSUE 1</span>
    </div>
    <h1 style="font-size: 56px; font-weight: 700; line-height: 1.1; margin-bottom: 20px; color: #18181b;">The Future of Human Resources</h1>
    <p style="font-size: 22px; color: #52525b; line-height: 1.5; font-style: italic;">An in-depth exploration of trends shaping the HR landscape</p>
  </div>
  
  <div style="display: grid; grid-template-columns: 1fr 3fr; gap: 40px; margin-bottom: 48px; font-family: 'Inter', sans-serif; font-size: 14px; color: #71717a;">
    <div>
      <p style="margin: 0; font-weight: 600;">WRITTEN BY</p>
      <p style="margin: 4px 0 0 0;">Editorial Team</p>
    </div>
    <div>
      <p style="margin: 0; font-weight: 600;">PUBLISHED</p>
      <p style="margin: 4px 0 0 0;">January 2025</p>
    </div>
  </div>
  
  <div style="font-size: 19px; line-height: 1.8; color: #3f3f46;">
    <p style="margin-bottom: 24px; font-size: 22px; font-weight: 600; line-height: 1.6;">This editorial template is designed for authoritative, long-form content that requires a traditional magazine layout. Perfect for research findings, industry reports, and comprehensive HR analyses.</p>
    
    <p style="margin-bottom: 24px;">Begin your detailed analysis here. Use this space to present well-researched insights, data-driven conclusions, and thoughtful commentary on HR topics that matter.</p>
    
    <h2 style="font-size: 32px; font-weight: 700; margin-top: 56px; margin-bottom: 24px; color: #18181b; border-bottom: 2px solid #e4e4e7; padding-bottom: 16px;">I. Introduction</h2>
    <p style="margin-bottom: 24px;">Structure your content with clear sections that guide readers through complex topics.</p>
    
    <div style="background: #fafafa; border-left: 4px solid #18181b; padding: 32px; margin: 40px 0; font-family: 'Inter', sans-serif;">
      <p style="font-size: 16px; font-weight: 600; color: #18181b; margin-bottom: 12px;">EXECUTIVE SUMMARY</p>
      <p style="font-size: 16px; line-height: 1.7; color: #52525b; margin: 0;">Use sections like this to highlight key findings, statistics, or important takeaways from your analysis.</p>
    </div>
  </div>
</div>
    `,
  },
]

export function getTemplatesByCategory(category: BlogTemplate["category"]) {
  return blogTemplates.filter((t) => t.category === category)
}

export function getTemplateById(id: string) {
  return blogTemplates.find((t) => t.id === id)
}
