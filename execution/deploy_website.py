#!/usr/bin/env python3
"""
Website deployment script
Part of the execution layer for Burak Studio agent architecture
Handles deployment to various platforms (GitHub Pages, Vercel, Netlify)
"""

import os
import sys
import argparse
import subprocess
from pathlib import Path
from dotenv import load_dotenv
import logging

# Import local utilities
sys.path.append(os.path.dirname(__file__))
from file_utils import FileUtils

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class WebsiteDeployer:
    """Handle website deployment to various platforms"""
    
    REQUIRED_FILES = [
        'index.html',
        'styles.css',
        'script.js',
        'logo.png'
    ]
    
    def __init__(self, platform: str = 'github'):
        self.platform = platform.lower()
        self.utils = FileUtils()
        
    def verify_prerequisites(self) -> bool:
        """Verify all required files exist"""
        logger.info("Verifying prerequisites...")
        results = self.utils.verify_files_exist(self.REQUIRED_FILES)
        
        missing_files = [f for f, exists in results.items() if not exists]
        if missing_files:
            logger.error(f"Missing required files: {', '.join(missing_files)}")
            return False
        
        logger.info("All required files present ✓")
        return True
    
    def deploy_github_pages(self) -> bool:
        """Deploy to GitHub Pages"""
        logger.info("Deploying to GitHub Pages...")
        
        try:
            # Check if git is initialized
            if not Path('.git').exists():
                logger.info("Initializing git repository...")
                subprocess.run(['git', 'init'], check=True)
            
            # Add all files
            subprocess.run(['git', 'add', '.'], check=True)
            
            # Commit
            subprocess.run(
                ['git', 'commit', '-m', 'Deploy website'],
                check=True
            )
            
            # Push to gh-pages branch
            logger.info("Pushing to gh-pages branch...")
            subprocess.run(
                ['git', 'push', 'origin', 'main:gh-pages', '--force'],
                check=True
            )
            
            logger.info("✓ Deployment to GitHub Pages successful!")
            return True
            
        except subprocess.CalledProcessError as e:
            logger.error(f"Git command failed: {e}")
            return False
        except Exception as e:
            logger.error(f"Deployment failed: {e}")
            return False
    
    def deploy_vercel(self) -> bool:
        """Deploy to Vercel"""
        logger.info("Deploying to Vercel...")
        
        try:
            # Check if vercel CLI is installed
            subprocess.run(['vercel', '--version'], check=True, capture_output=True)
            
            # Deploy
            result = subprocess.run(
                ['vercel', '--prod'],
                check=True,
                capture_output=True,
                text=True
            )
            
            logger.info("✓ Deployment to Vercel successful!")
            logger.info(f"URL: {result.stdout}")
            return True
            
        except FileNotFoundError:
            logger.error("Vercel CLI not found. Install with: npm i -g vercel")
            return False
        except subprocess.CalledProcessError as e:
            logger.error(f"Vercel deployment failed: {e}")
            return False
    
    def deploy_netlify(self) -> bool:
        """Deploy to Netlify"""
        logger.info("Deploying to Netlify...")
        
        try:
            # Check if netlify CLI is installed
            subprocess.run(['netlify', '--version'], check=True, capture_output=True)
            
            # Deploy
            result = subprocess.run(
                ['netlify', 'deploy', '--prod', '--dir=.'],
                check=True,
                capture_output=True,
                text=True
            )
            
            logger.info("✓ Deployment to Netlify successful!")
            logger.info(f"Result: {result.stdout}")
            return True
            
        except FileNotFoundError:
            logger.error("Netlify CLI not found. Install with: npm i -g netlify-cli")
            return False
        except subprocess.CalledProcessError as e:
            logger.error(f"Netlify deployment failed: {e}")
            return False
    
    def deploy(self) -> bool:
        """Main deployment method"""
        # Verify prerequisites
        if not self.verify_prerequisites():
            return False
        
        # Deploy based on platform
        if self.platform == 'github':
            return self.deploy_github_pages()
        elif self.platform == 'vercel':
            return self.deploy_vercel()
        elif self.platform == 'netlify':
            return self.deploy_netlify()
        else:
            logger.error(f"Unknown platform: {self.platform}")
            logger.info("Supported platforms: github, vercel, netlify")
            return False


def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description='Deploy Burak Studio website')
    parser.add_argument(
        '--platform',
        type=str,
        default='github',
        choices=['github', 'vercel', 'netlify'],
        help='Deployment platform (default: github)'
    )
    
    args = parser.parse_args()
    
    logger.info("=" * 50)
    logger.info("Burak Studio Website Deployment")
    logger.info("=" * 50)
    
    deployer = WebsiteDeployer(platform=args.platform)
    success = deployer.deploy()
    
    if success:
        logger.info("\n✓ Deployment completed successfully!")
        sys.exit(0)
    else:
        logger.error("\n✗ Deployment failed!")
        sys.exit(1)


if __name__ == "__main__":
    main()
