#!/usr/bin/env python3
"""
Utility functions for file operations
Part of the execution layer for Burak Studio agent architecture
"""

import os
import shutil
import json
from pathlib import Path
from typing import List, Dict, Any
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class FileUtils:
    """Utility class for common file operations"""
    
    @staticmethod
    def ensure_dir(directory: str) -> None:
        """Create directory if it doesn't exist"""
        Path(directory).mkdir(parents=True, exist_ok=True)
        logger.info(f"Ensured directory exists: {directory}")
    
    @staticmethod
    def copy_file(source: str, destination: str) -> bool:
        """Copy file from source to destination"""
        try:
            shutil.copy2(source, destination)
            logger.info(f"Copied {source} to {destination}")
            return True
        except Exception as e:
            logger.error(f"Failed to copy {source}: {e}")
            return False
    
    @staticmethod
    def read_json(filepath: str) -> Dict[Any, Any]:
        """Read and parse JSON file"""
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                data = json.load(f)
            logger.info(f"Read JSON from {filepath}")
            return data
        except Exception as e:
            logger.error(f"Failed to read JSON from {filepath}: {e}")
            return {}
    
    @staticmethod
    def write_json(filepath: str, data: Dict[Any, Any]) -> bool:
        """Write data to JSON file"""
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            logger.info(f"Wrote JSON to {filepath}")
            return True
        except Exception as e:
            logger.error(f"Failed to write JSON to {filepath}: {e}")
            return False
    
    @staticmethod
    def list_files(directory: str, extension: str | None = None) -> List[str]:
        """List all files in directory, optionally filtered by extension"""
        try:
            files = []
            for item in Path(directory).iterdir():
                if item.is_file():
                    if extension is None or item.suffix == extension:
                        files.append(str(item))
            logger.info(f"Found {len(files)} files in {directory}")
            return files
        except Exception as e:
            logger.error(f"Failed to list files in {directory}: {e}")
            return []
    
    @staticmethod
    def clean_tmp_dir(tmp_dir: str = '.tmp') -> bool:
        """Clean temporary directory"""
        try:
            if Path(tmp_dir).exists():
                shutil.rmtree(tmp_dir)
                logger.info(f"Cleaned temporary directory: {tmp_dir}")
            Path(tmp_dir).mkdir(exist_ok=True)
            return True
        except Exception as e:
            logger.error(f"Failed to clean {tmp_dir}: {e}")
            return False
    
    @staticmethod
    def verify_files_exist(files: List[str]) -> Dict[str, bool]:
        """Verify that all required files exist"""
        results = {}
        for filepath in files:
            exists = Path(filepath).exists()
            results[filepath] = exists
            if not exists:
                logger.warning(f"Required file not found: {filepath}")
            else:
                logger.info(f"Verified file exists: {filepath}")
        return results


if __name__ == "__main__":
    # Example usage
    utils = FileUtils()
    
    # Verify website files
    required_files = [
        'index.html',
        'styles.css',
        'script.js',
        'logo.svg'
    ]
    
    print("\nVerifying website files:")
    results = utils.verify_files_exist(required_files)
    for file, exists in results.items():
        status = "✓" if exists else "✗"
        print(f"{status} {file}")
