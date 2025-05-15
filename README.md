# AI Spot Finder - Interactive Location & Chat Recommender

AI Spot Finder is a web application that combines an interactive map with an AI chat interface to help users find optimal locations for businesses. Users can view existing markets on a map, chat with an AI assistant to get location recommendations, and explore those recommendations visually.

## Features

- **Interactive Map**: Full-screen, responsive map with existing market pins
- **AI Chat Interface**: Natural language conversation with an AI assistant
- **Location Recommendations**: AI suggests optimal locations based on user queries
- **Visual Recommendations**: Recommended locations are plotted on the map
- **Manual Selection**: Users can click any map location and ask for specific recommendations
- **Mobile-Friendly**: Responsive design with toggle between map and chat views

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Map**: Kakao Maps API
- **AI**: AI SDK with OpenAI integration
- **API**: Next.js API routes

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

\`\`\`
NEXT_PUBLIC_KAKAO_MAPS_API_KEY=your_kakao_maps_api_key
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
OPENAI_API_KEY=your_openai_api_key
\`\`\`

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Mapbox account for map functionality
- OpenAI API key for AI chat functionality

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/ai-spot-finder.git
   cd ai-spot-finder
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. Run the development server:
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Building for Production

1. Build the application:
   \`\`\`bash
   npm run build
   # or
   yarn build
   \`\`\`

2. Start the production server:
   \`\`\`bash
   npm start
   # or
   yarn start
   \`\`\`

## Usage

1. Open the application in your browser
2. Click "채팅 시작하기" to navigate to the map and chat interface
3. Explore the map to see existing markets
4. Chat with the AI assistant by typing queries like:
   - "이 지역에 어떤 업종이 부족해?"
   - "여기 음식점 스트리트로 추천해줘"
5. Click on the map to select a specific location and ask:
   - "이 위치에 부동산 중개소 추천해줘"
6. View AI recommendations on the map and click on markers for details

## License

This project is licensed under the MIT License - see the LICENSE file for details.
