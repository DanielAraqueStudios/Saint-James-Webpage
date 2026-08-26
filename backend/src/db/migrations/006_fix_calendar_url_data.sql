-- Repair any calendar_url values that got saved with extra text (e.g. a
-- pasted title alongside the link) by extracting just the http(s) URL.
-- Applies to every producer, not a specific one.
UPDATE producers
SET calendar_url = substring(calendar_url FROM 'https?://\S+')
WHERE calendar_url IS NOT NULL
  AND calendar_url !~* '^https?://\S+$';
