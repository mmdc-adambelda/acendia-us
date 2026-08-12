-- Renames the seeded plan display names per the owner's naming request.
-- Prices, slugs, and IDs are untouched — this only changes what clients see.
-- Run after 0001-0006.

update plans set name = 'SEO Package' where slug = 'growth-package';
update plans set name = 'Social Media Add-On' where slug = 'social-media-addon';
