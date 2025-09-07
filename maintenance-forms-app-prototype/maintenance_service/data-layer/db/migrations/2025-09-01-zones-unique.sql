-- Ensure case-insensitive uniqueness of zone labels per site
CREATE UNIQUE INDEX IF NOT EXISTS uq_zones_site_label
ON zones(site_id, zone_label COLLATE NOCASE);

-- Helpful index for listing by site
CREATE INDEX IF NOT EXISTS idx_zones_site ON zones(site_id);
