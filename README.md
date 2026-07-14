# AJYAL Initial

Standalone cPanel-ready homepage for AJYAL Sustainable Building Solutions.

## Project Structure

- `index.html` - homepage markup
- `assets/css/styles.css` - brand styling and responsive layout
- `assets/js/main.js` - navigation, scroll reveals, hero canvas, and form interactions
- `assets/img/` - optimized profile and presentation imagery
- `contact.php` - basic PHP `mail()` contact handler

## Deployment

Upload the repository contents to a PHP-enabled cPanel web root, or configure cPanel Git deployment to deploy this repository.

Before launch, open `contact.php` and confirm:

```php
$recipient_email = 'sales@ajyal.com.sa';
```

The form uses PHP `mail()`. Deliverability depends on the hosting account mail configuration.

## Notes

This project intentionally has no Node, React, Vite, or build step. It is designed to run as static HTML/CSS/JS with a small PHP mail endpoint.

