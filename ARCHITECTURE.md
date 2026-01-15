# 3-Layer Agent Architecture

This directory structure implements a robust 3-layer architecture for AI agent operations, separating concerns between what to do (directives), decision making (orchestration), and execution (deterministic scripts).

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│  Layer 1: DIRECTIVES (What to do)                   │
│  📁 directives/                                      │
│  ├── deploy_website.md                              │
│  ├── update_content.md                              │
│  └── optimize_performance.md                        │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  Layer 2: ORCHESTRATION (Decision making)           │
│  🤖 AI Agent                                         │
│  - Reads directives                                 │
│  - Makes intelligent routing decisions              │
│  - Handles errors and edge cases                    │
│  - Updates directives with learnings                │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  Layer 3: EXECUTION (Doing the work)                │
│  📁 execution/                                       │
│  ├── file_utils.py                                  │
│  ├── deploy_website.py                              │
│  └── optimize_assets.py                             │
└─────────────────────────────────────────────────────┘
```

## Why This Works

LLMs are probabilistic, but business logic requires consistency. This architecture:

- **Separates concerns**: Clear boundaries between planning, decision-making, and execution
- **Reduces errors**: 90% accuracy per step = 59% success over 5 steps. Deterministic scripts fix this.
- **Self-anneals**: System learns and improves from errors automatically
- **Scales reliably**: Add new capabilities by adding directives + scripts

## Directory Structure

```
Burak Studio/
├── directives/           # SOPs in Markdown
│   ├── deploy_website.md
│   ├── update_content.md
│   └── optimize_performance.md
├── execution/            # Python scripts
│   ├── file_utils.py
│   ├── deploy_website.py
│   └── optimize_assets.py
├── .tmp/                 # Temporary/intermediate files
├── .env                  # Environment variables
└── .gitignore           # Git ignore rules
```

## Quick Start

### 1. Deploy Website

```bash
python execution/deploy_website.py --platform github
```

### 2. Optimize Assets

```bash
python execution/optimize_assets.py --dry-run
```

### 3. Verify Files

```bash
python execution/file_utils.py
```

## Workflow

### For AI Agents:

1. **Read the directive** for the task (e.g., `directives/deploy_website.md`)
2. **Make decisions** about inputs, outputs, and edge cases
3. **Call execution scripts** in the right order
4. **Handle errors** and update directives with learnings

### For Developers:

1. **Create directives** for new workflows
2. **Write deterministic scripts** for execution layer
3. **Let AI handle** orchestration and decision-making
4. **Update directives** as you discover edge cases

## Operating Principles

### 1. Check for tools first

Before creating new scripts, check `execution/` directory per your directive.

### 2. Self-anneal when things break

- Read error messages and stack traces
- Fix the script and test again
- Update the directive with learnings
- System becomes stronger

### 3. Update directives as you learn

Directives are living documents. When you discover:

- API constraints
- Better approaches
- Common errors
- Timing expectations

→ Update the relevant directive!

## File Organization

### Deliverables vs Intermediates

- **Deliverables**: Cloud-based outputs (Google Sheets, deployed websites)
- **Intermediates**: Temporary files in `.tmp/` (can be deleted/regenerated)

### Environment Variables

Store sensitive data in `.env`:

```bash
GOOGLE_CLIENT_ID=your_id
GOOGLE_CLIENT_SECRET=your_secret
```

## Available Directives

- **deploy_website.md** - Deploy to GitHub Pages, Vercel, or Netlify
- **update_content.md** - Update website content and sections
- **optimize_performance.md** - Improve speed and performance scores

## Available Scripts

- **file_utils.py** - Common file operations and utilities
- **deploy_website.py** - Automated deployment to various platforms
- **optimize_assets.py** - Image, CSS, and JS optimization

## Dependencies

```bash
# Core
pip install python-dotenv

# Optional (for full functionality)
pip install Pillow cssmin jsmin
```

## Best Practices

1. **Always backup** before running destructive operations
2. **Test in .tmp/** before modifying production files
3. **Update directives** when you learn something new
4. **Keep scripts deterministic** - same input = same output
5. **Log everything** - debugging is easier with good logs

## Contributing

When adding new functionality:

1. Create a directive in `directives/` explaining the workflow
2. Write a deterministic script in `execution/`
3. Test thoroughly
4. Update this README if needed

## Notes

- All `.tmp/` files can be safely deleted
- Scripts are self-documenting with logging
- Directives use natural language for clarity
- System improves over time through self-annealing

---

**Remember**: You (the AI agent) sit between human intent (directives) and deterministic execution (Python scripts). Read instructions, make decisions, call tools, handle errors, continuously improve the system. Be pragmatic. Be reliable. Self-anneal.
