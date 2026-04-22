# Letreiro Digital - Online LED Display Simulator

## 🌟 Overview
Letreiro Digital is a modern web application that simulates LED display boards directly in your browser. Built with Next.js 14 and TypeScript, it offers a responsive and intuitive interface for creating dynamic LED-style digital signs.

## 🚀 Key Features
- Real-time LED display simulation
- Customizable text and display settings
- Multi-language support (English, Chinese, Spanish, Portuguese)
- Responsive design for all devices
- Adjustable scrolling speed
- Full-screen mode
- Custom text and background colors
- Flip and reverse display options

## 🛠 Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Internationalization:** next-intl
- **Deployment:** Vercel
- **State Management:** React Hooks

## 📁 Project Structure
├── app/
│ ├── [locale]/ # Multi-language routing
│ │ ├── (with-footer)/ # Layout organization
│ │ │ └── (home)/ # Home page
│ │ ├── layout.tsx # Layout component
│ │ └── template.tsx # Page template
├── components/
│ ├── MarqueeLED/ # Core LED display component
│ ├── home/ # Home page components
│ │ ├── Navigation.tsx # Navigation component
│ │ └── QuickMenu.tsx # Quick menu
│ └── LocaleSwitcher.tsx # Language switcher
├── messages/ # Multi-language files
│ ├── en.json
│ ├── es.json
│ ├── br.json
└── public/ # Static assets


## 🌍 Internationalization
The application supports multiple languages through next-intl:
- English (en)
- Spanish (es)
- Portuguese (br)

## 💻 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Installation
1. Clone the repository:
> git clone https://github.com/outwebfeng/letreiro.org


2. Install dependencies:
> npm install
or
> yarn install


3. Run the development server:
> npm run dev
or
> yarn dev


4. Open [https://letreiro.org](https://letreiro.org) in your browser

## 🚀 Deployment

The project is optimized for Vercel deployment:

1. Connect your GitHub repository to Vercel
2. Configure environment variables (if needed)
3. Deploy automatically with git push

## 📱 Responsive Design
- Mobile-first approach
- Desktop and mobile navigation adaptation
- Smooth full-screen mode transitions
- Layouts optimized for all screen sizes

## 🔒 Security Features
- Client-side only functionality
- No personal data collection
- Secure by design
- HTTPS enforcement

## 🎯 Performance Optimizations
- Dynamic component imports
- Image optimization
- Client-side rendering for interactive elements
- Static generation for static content
- Efficient state management

## 🧪 Testing
To run tests:
> npm test
or
> yarn test


## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support
For support or queries:
- Email: support@letreiro.org
- GitHub Issues: [Create an issue](https://github.com/outwebfeng/letreiro.org/issues)

## 🙏 Acknowledgments
- Next.js team for the amazing framework
- Vercel for hosting and deployment
- All contributors and users of the application

---