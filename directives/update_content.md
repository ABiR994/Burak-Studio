# Update Website Content

## Goal

Update content on the Burak Studio website including text, images, services, or portfolio items

## Inputs

- Section to update (hero, services, portfolio, about, contact)
- New content (text, images, links)
- Content type (text update, new service, new portfolio item, etc.)

## Tools & Scripts

- `execution/update_content.py` - Content update automation
- Manual editing for complex changes
- Image optimization tools

## Process

1. **Identify Target**

   - Determine which file needs updating (`index.html`, `styles.css`, `script.js`)
   - Locate specific section/element

2. **Prepare Content**

   - Format text appropriately
   - Optimize images (compress, resize)
   - Validate links and URLs

3. **Apply Updates**

   ```bash
   python execution/update_content.py --section <section> --type <type>
   ```

   Or manually edit the files

4. **Test Changes**
   - Open in browser
   - Check responsiveness
   - Verify styling consistency

## Outputs

- Updated website files
- Change log
- Preview screenshots (optional)

## Edge Cases

- **Breaking layout**: Test on multiple screen sizes after changes
- **Invalid HTML**: Validate markup after updates
- **Missing assets**: Ensure all referenced images/files exist
- **Style conflicts**: Check CSS doesn't break existing elements

## Common Updates

### Add New Service

- Update `index.html` services section
- Add service card with icon, title, description, features
- Maintain consistent styling with existing cards

### Add Portfolio Item

- Add new portfolio card
- Include image/placeholder, title, description, tags
- Ensure proper grid layout

### Update Contact Info

- Modify email, phone, address in contact section
- Update footer if needed

## Success Criteria

- Content displays correctly
- No layout breaks
- Consistent styling
- Responsive on all devices
- Logo still displays properly

## Notes

- Always backup before major changes
- Test in multiple browsers
- Keep design consistency
- Update README if structure changes
