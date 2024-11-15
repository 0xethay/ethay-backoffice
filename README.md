# Ethay Backoffice

A web-based backoffice dashboard built with Next.js, TypeScript, and Tailwind CSS. This application provides seller management and administrative functionalities.

## 🚀 Features

- Modern dashboard interface
- Seller management system
- Authentication and authorization
- Responsive design with Tailwind CSS
- Built with TypeScript for type safety

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 16.x or higher)
- pnpm (recommended) or npm
- Git

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/0xethay/ethay-backoffice.git
cd ethay-backoffice
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Then edit `.env.local` with your configuration values.

## 🚀 Running the Project

### Development Mode
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
pnpm build
pnpm start
```

## 📁 Project Structure

```
src/
├── app/                 # App router pages
│   ├── dashboard/      # Dashboard routes
│   └── login/          # Authentication pages
├── components/         # Reusable components
└── middleware.ts       # Authentication middleware
```

## 🔧 Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Next Auth](https://next-auth.js.org/) - Authentication

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

Your Name - [@your_twitter](https://twitter.com/your_twitter)

Project Link: [https://github.com/0xethay/ethay-backoffice](https://github.com/0xethay/ethay-backoffice)
