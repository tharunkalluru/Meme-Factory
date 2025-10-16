# Contributing to Meme Factory

Thank you for your interest in contributing to Meme Factory! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/yourusername/meme-factory/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)
   - Environment details (browser, OS, etc.)

### Suggesting Features

1. Check existing [Discussions](https://github.com/yourusername/meme-factory/discussions)
2. Create a new discussion with:
   - Clear use case
   - Expected behavior
   - Why this benefits users
   - Possible implementation approach

### Submitting Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/meme-factory.git
   cd meme-factory
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the code style (see below)
   - Add tests if applicable
   - Update documentation

4. **Test locally**
   ```bash
   npm install
   npm run dev
   npm run build
   npm run lint
   ```

5. **Commit with clear messages**
   ```bash
   git add .
   git commit -m "feat: add new watermark styles"
   ```

6. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then create a pull request on GitHub.

## Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- OpenAI API key

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/meme-factory.git
cd meme-factory

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local and add your OPENAI_API_KEY

# Start development server
npm run dev
```

### Project Structure

```
meme-factory/
├── src/
│   ├── app/              # Next.js pages and API routes
│   ├── components/       # React components
│   ├── lib/              # Utility libraries
│   └── types/            # TypeScript definitions
├── public/               # Static assets
├── docs/                 # Documentation
└── tests/                # Tests (to be added)
```

## Code Style

### TypeScript

- Use TypeScript for all new files
- Define interfaces for all data structures
- Avoid `any` types when possible
- Use meaningful variable names

### React Components

- Use functional components with hooks
- Prefer `useCallback` for event handlers
- Add proper TypeScript props interfaces
- Keep components focused and single-purpose

### Naming Conventions

- **Components:** PascalCase (e.g., `ImageUpload.tsx`)
- **Files:** kebab-case (e.g., `meme-renderer.ts`)
- **Functions:** camelCase (e.g., `generateMemes`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `MAX_FILE_SIZE`)

### Code Formatting

```bash
# Run linter
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

## Testing

### Manual Testing Checklist

- [ ] Upload PNG image (< 5MB)
- [ ] Upload JPG image (< 5MB)
- [ ] Try uploading image > 5MB (should fail)
- [ ] Enter topic (120 chars)
- [ ] Generate memes
- [ ] Download individual meme
- [ ] Download collage
- [ ] Test on Chrome, Firefox, Safari
- [ ] Test on mobile browser

### Unit Tests (Coming Soon)

```bash
npm test
```

## Documentation

When contributing, please update relevant documentation:

- `README.md` - User-facing documentation
- `docs/ARCHITECTURE.md` - Technical architecture
- `docs/API.md` - API documentation
- Inline code comments for complex logic

## Commit Messages

Follow conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

Examples:
```
feat: add bottom text position option
fix: correct text wrapping for long captions
docs: update deployment guide for Railway
```

## Pull Request Guidelines

### Before Submitting

- [ ] Code builds without errors
- [ ] All tests pass (when available)
- [ ] Documentation updated
- [ ] No linter warnings
- [ ] Tested on multiple browsers

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How was this tested?

## Screenshots
If applicable

## Checklist
- [ ] Code builds
- [ ] Tests pass
- [ ] Documentation updated
- [ ] No linter warnings
```

## Release Process

(For maintainers)

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create release tag
4. Deploy to production
5. Announce release

## Getting Help

- **Discussions:** [GitHub Discussions](https://github.com/yourusername/meme-factory/discussions)
- **Issues:** [GitHub Issues](https://github.com/yourusername/meme-factory/issues)
- **Email:** contribute@meme-factory.app

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Meme Factory! 🎨

