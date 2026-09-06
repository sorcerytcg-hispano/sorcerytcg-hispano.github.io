# Editorial notes for version 0.1.0

## Source handling

The uploaded resource list is the primary source for local communities and tournament rules. The linked Google document was successfully exported and read, including its store hyperlinks. Both source lists were consolidated and duplicate entries removed. Names, countries, invitation codes, and supplied local shop names were preserved. No Discord channel IDs or invitation links were invented.

The official player guide, Codex, current linked rulebook, card library, deck library, and store locator were checked on 2026-09-06. The site links to these current official locations instead of relying exclusively on older Curiosa routes. The supplied font and two official graphic assets are local files.

## Still to confirm with the owner

- Exact Discord channels and channel links for beginner help, finding games, and the league. Until provided, all entry points use the supplied community invitation.
- A specific active tournament, its dates, and whether its rules differ from the supplied league rules. The page links to the Challonge community and does not invent an active season.
- Private WhatsApp and Discord invitations have not been joined or membership-tested. They are preserved exactly as supplied.
- Store product categories are source-reported, not real-time stock. Shipping regions and prices must be checked with each seller.
- The supplied Steam Workshop listing resolves, but contains reports about deck-import problems. The page advises checking the module before arranging a game and does not claim end-to-end platform testing.
- The supplied Play Sorcery Online association with Sorcerer's Summit was not independently established, so the platform card does not assert that affiliation.
- The original guide's past event dates, unfinished placeholders, exact Dust reward amounts, and recurring local schedules were not presented as current information.

## Publication

GitHub reported `has_pages: true` before development. The exact Pages source configuration has not been changed or assumed. The release branch must be reviewed before merging. Selecting GitHub Actions as the Pages source and merging the branch are separate, pending publication steps.

## Link checks

Automated HTTP checks were run for store, marketplace, platform, and league URLs. White Rabbit's old category returned 404 and was replaced with its verified current category: https://shop.whiterabbit-cgs.de/Sorcery-Contested-Realm_1 . Rubble was upgraded to its verified HTTPS destination. Some sites blocked automated requests or timed out, including Just Freak, Distrito Zero, LigaSorcery, Challonge, and TCGplayer; these supplied links remain and are not presented as fully tested. Play Sorcery Online and Sorcery TCG Europe were also corroborated through web search.
