# Contributing to Blu

First off, thank you for considering contributing to Blu! 

It's people like you that make Blu an amazing tool for developers everywhere. Whether you're fixing a typo, adding a feature, or reporting a bug, your help is greatly appreciated.

## How Can I Contribute?

### Reporting Bugs
Found something that's not working right? Here's how to report it:

1. **Check the existing issues** to see if someone else already reported it
2. **Open a new issue** if it's not already reported
3. **Be specific** - include:
   - What you were trying to do
   - What actually happened
   - Steps to reproduce the issue
   - Screenshots or error messages if possible
   - Your VS Code version and operating system

### Suggesting Features
Have an idea to make Blu even better? We'd love to hear it!

1. **Check the discussions** first to see if it's already been suggested
2. **Start a new discussion** in the Feature Requests section
3. **Explain clearly**:
   - What problem this feature would solve
   - How you imagine it working
   - Why it would be helpful for other users

### Code Contributions
Ready to roll up your sleeves and write some code? Awesome!

#### Setting Up Your Development Environment

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/<YOUR_USERNAME>/blu.git
   cd blu
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Build the extension**:
   ```bash
   npm run compile
   ```

5. **Open in VS Code** and press `F5` to start debugging

#### Making Changes

1. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-youre-fixing
   ```

2. **Make your changes** - remember to:
   - Follow the existing code style
   - Add comments where helpful
   - Update documentation if needed
   - Write or update tests if applicable

3. **Test your changes**:
   - Run the extension in debug mode (`F5`)
   - Make sure existing functionality still works
   - Test your specific changes thoroughly

4. **Commit your changes** with clear messages:
   ```bash
   git add .
   git commit -m "Add: description of what you added"
   # or
   git commit -m "Fix: description of what you fixed"
   ```

5. **Push to your fork**:
   ```bash
   git push origin your-branch-name
   ```

6. **Open a Pull Request** on the main repository

### Improving Documentation
Good documentation helps everyone! You can help by:

- Fixing typos or unclear explanations
- Adding examples or tutorials
- Translating documentation into other languages
- Improving the README or contribution guidelines

## What Should I Work On?

Not sure where to start? Here are some ideas:

- **Good first issues**: Look for issues tagged with `good first issue`
- **Documentation**: Check if any documentation is missing or unclear
- **Bugs**: Help fix issues that affect many users
- **Features**: Implement features that have community support

## Code Style Guidelines

- Use **TypeScript** for all new code
- Follow existing naming conventions
- Add comments for complex logic
- Keep functions focused and small
- Use meaningful variable names

## Testing Your Changes

Before submitting your changes:

1. Run the existing tests (if any)
2. Manually test your changes in different scenarios
3. Make sure you didn't break anything else
4. Test with different AI providers if possible

## Need Help?

- **Check the discussions** for similar questions
- **Open an issue** if you're stuck
- **Be patient** - we're all volunteers here!

## Code of Conduct

Be respectful, patient, and helpful. We're all here to make a great tool for developers. Harassment or disrespectful behavior won't be tolerated.

---

## Quick Start for Contributors

```bash
# 1. Fork and clone
git clone https://github.com/<YOUR_USERNAME>/blu.git
cd blu

# 2. Install and build
npm install
npm run compile

# 3. Open in VS Code and press F5 to debug
code .
```

Once again, thank you for your interest in contributing to Blu! Every contribution, no matter how small, helps make Blu better for everyone.
