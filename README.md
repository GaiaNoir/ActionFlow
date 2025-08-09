# Meeting Action Items - Professional Meeting Analysis Tool

Transform your meetings into actionable results with AI-powered analysis. Upload audio recordings or paste meeting transcripts to automatically generate summaries, action items, decisions, and next steps.

## ✨ Features

- **🎤 Audio Processing**: Upload meeting recordings (MP3, MP4, WAV, M4A) for automatic transcription
- **📝 Text Analysis**: Paste meeting notes or transcripts for instant analysis
- **🤖 AI-Powered**: Uses OpenAI's GPT-4 and Whisper for accurate transcription and analysis
- **📋 Structured Output**: Generates professional summaries, action items, decisions, and next steps
- **📧 Export Options**: Copy results as formatted documents or email templates
- **⚡ Real-time Processing**: Live progress tracking with estimated completion times
- **🎨 Professional UI**: Modern, responsive design with smooth animations
- **📱 Mobile Friendly**: Works seamlessly across all devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd meeting-action-items
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` and add your OpenAI API key:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key for GPT-4 and Whisper | ✅ Yes |
| `OPENAI_ORG_ID` | OpenAI Organization ID (if applicable) | ❌ No |
| `NODE_ENV` | Environment (development/production) | ❌ No |
| `NEXT_PUBLIC_APP_URL` | Your app's public URL | ❌ No |

## 🌐 Vercel Deployment

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/meeting-action-items)

### Manual Deployment Steps

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Environment Variables**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add `OPENAI_API_KEY` with your API key

4. **Deploy**
   - Click "Deploy"
   - Your app will be live at `https://your-project.vercel.app`

## 🔑 OpenAI API Key Setup

1. **Create OpenAI Account**
   - Visit [platform.openai.com](https://platform.openai.com)
   - Sign up or log in

2. **Generate API Key**
   - Go to [API Keys](https://platform.openai.com/api-keys)
   - Click "Create new secret key"
   - Copy the key (you won't see it again!)

3. **Add Billing Information**
   - Go to [Billing](https://platform.openai.com/account/billing)
   - Add payment method
   - Set usage limits if desired

4. **Test Your Setup**
   - Add the key to your `.env.local` file
   - Run the app and try processing a meeting

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── process-meeting/ # Main processing endpoint
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Home page
│   ├── not-found.tsx     # 404 error page
│   └── error.tsx         # Global error page
├── components/            # React components
│   ├── FileUpload.tsx    # File upload component
│   ├── Results.tsx       # Results display
│   ├── Loading.tsx       # Loading states
│   ├── Toast.tsx         # Notifications
│   └── ErrorDisplay.tsx  # Error handling
├── types/                # TypeScript definitions
├── utils/                # Utility functions
└── hooks/                # Custom React hooks
```

## 🎯 Usage Guide

### Processing Audio Files

1. **Upload Audio**: Click "Choose File" and select your meeting recording
2. **Supported Formats**: MP3, MP4, WAV, M4A (max 100MB)
3. **Processing**: Watch real-time progress through transcription and analysis
4. **Results**: Get structured output with summaries and action items

### Processing Text

1. **Paste Text**: Enter meeting notes or transcripts in the text area
2. **Minimum Length**: At least 50 characters for meaningful analysis
3. **Processing**: AI analyzes content for key insights
4. **Results**: Receive formatted summaries and next steps

### Exporting Results

- **Copy All**: Professional document format with emojis and structure
- **Copy as Email**: Ready-to-send email template with proper formatting
- **Print**: Clean, printer-friendly layout

## 🛠️ Troubleshooting

### Common Issues

**"API key not found" Error**
- Ensure `OPENAI_API_KEY` is set in `.env.local`
- Restart the development server after adding environment variables
- Check for typos in the variable name

**"File too large" Error**
- Maximum file size is 100MB
- Compress your audio file or use a shorter recording
- Consider splitting long meetings into segments

**"Unsupported format" Error**
- Use supported formats: MP3, MP4, WAV, M4A
- Convert your file using online tools or audio software

**Processing Takes Too Long**
- Large files (>50MB) may take 2-3 minutes
- Check your internet connection
- Ensure sufficient OpenAI API credits

**Deployment Issues**
- Verify all environment variables are set in Vercel
- Check build logs for specific error messages
- Ensure your OpenAI API key has sufficient credits

### Getting Help

- Check the browser console for error messages
- Review the Network tab for failed API requests
- Ensure your OpenAI account has available credits
- Contact support if issues persist

## 🔒 Security & Privacy

- **No Data Storage**: Audio files and transcripts are not stored permanently
- **Secure Processing**: All data is processed securely through OpenAI's API
- **Environment Variables**: Sensitive keys are stored as environment variables
- **HTTPS Only**: All communication is encrypted in production

## 📊 Performance

- **Optimized Loading**: Progressive loading with skeleton screens
- **File Compression**: Automatic compression for large uploads
- **Caching**: Efficient caching for faster subsequent loads
- **Mobile Optimized**: Responsive design for all screen sizes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenAI](https://openai.com) for GPT-4 and Whisper APIs
- [Next.js](https://nextjs.org) for the React framework
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Vercel](https://vercel.com) for hosting platform

---

**Made with ❤️ for productive meetings**
