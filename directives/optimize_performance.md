# Optimize Website Performance

## Goal

Improve website loading speed, performance scores, and user experience

## Inputs

- Current website files
- Performance metrics (from Lighthouse, PageSpeed Insights)
- Target performance goals

## Tools & Scripts

- `execution/optimize_assets.py` - Asset optimization script
- Image compression tools
- CSS/JS minification
- Lighthouse CLI for testing

## Process

1. **Run Performance Audit**

   ```bash
   lighthouse https://your-website-url --view
   ```

2. **Identify Issues**

   - Large images
   - Unminified CSS/JS
   - Render-blocking resources
   - Unused code

3. **Apply Optimizations**

   ```bash
   python execution/optimize_assets.py
   ```

4. **Re-test**
   - Run Lighthouse again
   - Compare scores
   - Verify improvements

## Optimization Techniques

### Images

- Compress with minimal quality loss
- Convert to modern formats (WebP)
- Implement lazy loading
- Use appropriate dimensions

### CSS

- Minify CSS files
- Remove unused styles
- Combine files where appropriate
- Use critical CSS for above-fold content

### JavaScript

- Minify JS files
- Remove unused code
- Defer non-critical scripts
- Use async loading

### Fonts

- Preload critical fonts
- Use font-display: swap
- Subset fonts to reduce size

## Outputs

- Optimized assets
- Performance report
- Before/after metrics comparison
- Recommendations for further improvements

## Edge Cases

- **Over-compression**: Balance file size vs quality
- **Breaking changes**: Test thoroughly after minification
- **Cache issues**: Clear cache when testing
- **Browser compatibility**: Ensure optimizations work across browsers

## Success Criteria

- Lighthouse score > 90 for Performance
- First Contentful Paint < 1.5s
- Time to Interactive < 3s
- Cumulative Layout Shift < 0.1
- Logo loads quickly without flickering

## Notes

- Always keep unoptimized originals
- Test on real devices, not just desktop
- Monitor performance over time
- Consider CDN for static assets
- Update this directive with API limits or timing constraints discovered
