import os

def create_file(filepath, content):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, 'w') as f:
        f.write(content.strip() + "\n")

# 1. components/ui/
ui_components = ['Button', 'Badge', 'Modal', 'Accordion', 'Tabs', 'Input', 'Tooltip']
for comp in ui_components:
    create_file(f'components/ui/{comp}.tsx', f'''
import React from 'react';
export function {comp}({{ children, ...props }}: any) {{
  return <div className="{comp.lower()}-component" {{...props}}>{{children || '{comp} Component'}}</div>;
}}
''')

# 2. app/(site)/knowledge/[slug]/
knowledge_sections = ['ReadingProgressBar', 'ArticleHeader', 'ArticleBody', 'TableOfContents', 'SourceCitations', 'CorrectionLog', 'ReferencesSection', 'RelatedArticles', 'ShareBar']
for section in knowledge_sections:
    create_file(f'app/(site)/knowledge/[slug]/sections/{section}.tsx', f'''
import React from 'react';
export function {section}() {{
  return <section className="p-4 border border-gray-200 my-4 rounded"><h2>{section}</h2></section>;
}}
''')
create_file('app/(site)/knowledge/[slug]/page.tsx', '''
import React from 'react';
''' + '\\n'.join([f"import {{ {s} }} from './sections/{s}';" for s in knowledge_sections]) + '''

export default function ArticleReaderPage() {
  return (
    <main>
      <h1>Article Reader</h1>
''' + '\\n'.join([f"      <{s} />" for s in knowledge_sections]) + '''
    </main>
  );
}
''')

# 3. discover and its subdirectories
discover_dirs = {
    'discover': ['DiscoverHero', 'GameCards', 'DailyFact', 'Leaderboard', 'InteractiveLinks'],
    'discover/quiz': ['QuizWelcome', 'QuizQuestion', 'QuizAnswerReveal', 'QuizScoreCard'],
    'discover/sort-it-out': ['SortIntro', 'SortGameBoard', 'SortFeedback', 'SortResults'],
    'discover/guess-it': ['GuessIntro', 'GuessRound', 'GuessReveal', 'GuessResults'],
    'discover/paper-trail': ['TrailIntro', 'TrailOrderGame', 'TrailTimeline', 'TrailResults']
}

for path, sections in discover_dirs.items():
    for section in sections:
        create_file(f'app/(site)/{path}/sections/{section}.tsx', f'''
import React from 'react';
export function {section}() {{
  return <section className="p-4 border my-4"><h2>{section}</h2></section>;
}}
''')
    
    # create page.tsx
    create_file(f'app/(site)/{path}/page.tsx', '''
import React from 'react';
''' + '\\n'.join([f"import {{ {s} }} from './sections/{s}';" for s in sections]) + f'''

export default function {path.replace("/", "").title()}Page() {{
  return (
    <main>
      <h1>{path.replace("/", " ").title()}</h1>
''' + '\\n'.join([f"      <{s} />" for s in sections]) + '''
    </main>
  );
}
''')

# 4. app/admin/ pages
admin_pages = {
    'layout': 'export default function AdminLayout({ children }: { children: React.ReactNode }) { return <div className="admin-layout">{children}</div>; }',
    'page': 'export default function AdminDashboard() { return <div>Admin Dashboard</div>; }',
    'login/page': 'export default function AdminLogin() { return <div>Admin Login</div>; }',
    'articles/page': 'export default function AdminArticles() { return <div>Articles Manager</div>; }',
    'articles/[id]/page': 'export default function AdminArticleEditor() { return <div>Article Editor</div>; }',
    'myths/page': 'export default function AdminMyths() { return <div>Myths Manager</div>; }',
    'games/page': 'export default function AdminGames() { return <div>Games Manager</div>; }',
    'resources/page': 'export default function AdminResources() { return <div>Resources Manager</div>; }',
    'glossary/page': 'export default function AdminGlossary() { return <div>Glossary Manager</div>; }',
    'newsroom/page': 'export default function AdminNewsroom() { return <div>Newsroom Manager</div>; }',
    'inquiries/page': 'export default function AdminInquiries() { return <div>Inquiries Inbox</div>; }',
    'subscribers/page': 'export default function AdminSubscribers() { return <div>Subscribers Manager</div>; }',
    'media/page': 'export default function AdminMedia() { return <div>Media Library</div>; }',
    'analytics/page': 'export default function AdminAnalytics() { return <div>Analytics Dashboard</div>; }',
    'settings/page': 'export default function AdminSettings() { return <div>Site Settings</div>; }'
}

for path, content in admin_pages.items():
    create_file(f'app/admin/{path}.tsx', f'''
import React from 'react';
{content}
''')

# 5. lib/
lib_files = {
    'db.ts': 'export const connectDB = async () => { console.log("Connecting to DB..."); };',
    'auth.ts': 'export const authOptions = {};',
    'cloudinary.ts': 'export const uploadImage = async () => { return "url"; };',
    'utils.ts': 'export const cn = (...classes: string[]) => classes.filter(Boolean).join(" ");',
    'analytics.ts': 'export const trackEvent = (event: string) => { console.log(event); };'
}
for name, content in lib_files.items():
    create_file(f'lib/{name}', content)

# 6. lib/models/
models = ['Article', 'Myth', 'Resource', 'Glossary', 'Game', 'Inquiry', 'Subscriber', 'NewsItem', 'Correction', 'Analytics']
for model in models:
    create_file(f'lib/models/{model}.ts', f'''
import mongoose from 'mongoose';
const {model}Schema = new mongoose.Schema({{ name: String }});
export const {model} = mongoose.models.{model} || mongoose.model('{model}', {model}Schema);
''')

# 7. lib/validators/
validators = ['article', 'myth', 'inquiry', 'subscriber']
for val in validators:
    create_file(f'lib/validators/{val}.ts', f'''
import {{ z }} from 'zod';
export const {val}Schema = z.object({{ name: z.string() }});
''')

# 8. app/api/
api_routes = ['articles', 'myths', 'resources', 'glossary', 'games', 'inquiries', 'subscribers', 'newsroom', 'analytics', 'corrections', 'upload', 'auth/[...nextauth]']
for route in api_routes:
    create_file(f'app/api/{route}/route.ts', f'''
import {{ NextResponse }} from 'next/server';
export async function GET() {{ return NextResponse.json({{ message: 'GET {route}' }}); }}
export async function POST() {{ return NextResponse.json({{ message: 'POST {route}' }}); }}
''')

# 9. content/seed/
seeds = ['articles', 'myths', 'resources', 'quiz', 'glossary', 'timeline', 'sort-items', 'guess-products', 'everyday-paper']
for seed in seeds:
    create_file(f'content/seed/{seed}.json', '[\n  {\n    "id": 1,\n    "name": "Sample data"\n  }\n]')

# 10. scripts/
create_file('scripts/seed.ts', '''
console.log('Seeding data...');
''')
create_file('scripts/hash-password.ts', '''
console.log('Hashing password...');
''')

print("All remaining files generated successfully.")
