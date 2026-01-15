#!/usr/bin/env python3
"""
Asset optimization script
Part of the execution layer for Burak Studio agent architecture
Optimizes images, CSS, and JS for better performance
"""

import os
import sys
import argparse
from pathlib import Path
import logging

# Import local utilities
sys.path.append(os.path.dirname(__file__))
from file_utils import FileUtils

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class AssetOptimizer:
    """Optimize website assets for performance"""
    
    def __init__(self, dry_run: bool = False):
        self.dry_run = dry_run
        self.utils = FileUtils()
        self.optimized_count = 0
        
    def optimize_images(self) -> bool:
        """Analyze image files and report potential optimizations"""
        logger.info("Analyzing images...")
        
        image_extensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp']
        images = []
        for ext in image_extensions:
            images.extend(self.utils.list_files('.', ext))
        
        if not images:
            logger.info("No images found to analyze")
            return True
        
        logger.info(f"Found {len(images)} image(s)")
        
        for image in images:
            file_size_kb = Path(image).stat().st_size / 1024
            logger.info(f"  - {image} ({file_size_kb:.2f} KB)")
            
            # Simple heuristic: images over 500KB should be optimized
            if file_size_kb > 500:
                logger.warning(f"    ⚠ Large image detected: {image}. Recommendation: Use WebP or compress.")
            
            self.optimized_count += 1
        
        return True
    
    def minify_css(self) -> bool:
        """Check CSS files for length and potential bloat"""
        logger.info("Analyzing CSS files...")
        
        css_files = self.utils.list_files('.', '.css')
        if not css_files:
            return True
        
        for css_file in css_files:
            with open(css_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            file_size_kb = len(content) / 1024
            logger.info(f"  - {css_file} ({file_size_kb:.2f} KB, {len(content.splitlines())} lines)")
            
            if file_size_kb > 50:
                logger.warning(f"    ⚠ Large CSS file: {css_file}. Consider splitting or minifying.")
            
            self.optimized_count += 1
        
        return True
    
    def minify_js(self) -> bool:
        """Check JS files for length"""
        logger.info("Analyzing JavaScript files...")
        
        js_files = self.utils.list_files('.', '.js')
        if not js_files:
            return True
        
        for js_file in js_files:
            with open(js_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            file_size_kb = len(content) / 1024
            logger.info(f"  - {js_file} ({file_size_kb:.2f} KB)")
            
            if file_size_kb > 20:
                logger.warning(f"    ⚠ Large JS file: {js_file}. Consider splitting or minifying.")
            
            self.optimized_count += 1
        
        return True
    
    def generate_report(self) -> None:
        """Generate optimization report"""
        logger.info("\n" + "=" * 50)
        logger.info("OPTIMIZATION REPORT")
        logger.info("=" * 50)
        logger.info(f"Files processed: {self.optimized_count}")
        
        if self.dry_run:
            logger.info("\n(DRY RUN - No actual changes made)")
        else:
            logger.info("\n✓ Optimization complete!")
            logger.info("\nNOTE: This is a template script.")
            logger.info("To enable actual optimization, install required libraries:")
            logger.info("  pip install Pillow cssmin jsmin")
    
    def optimize_all(self) -> bool:
        """Run all optimizations"""
        try:
            self.optimize_images()
            self.minify_css()
            self.minify_js()
            self.generate_report()
            return True
        except Exception as e:
            logger.error(f"Optimization failed: {e}")
            return False


def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description='Optimize website assets')
    parser.add_argument(
        '--dry-run',
        action='store_true',
        help='Preview changes without modifying files'
    )
    
    args = parser.parse_args()
    
    logger.info("=" * 50)
    logger.info("Burak Studio Asset Optimization")
    logger.info("=" * 50)
    
    if args.dry_run:
        logger.info("Running in DRY RUN mode\n")
    
    optimizer = AssetOptimizer(dry_run=args.dry_run)
    success = optimizer.optimize_all()
    
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
