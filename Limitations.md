These features can be considered "limitations" of the application.

## 1. Topic search. 

This is really a search for words, not for topics. Content relevant to the topic is not included if it doesn't contain the search term. The results are also not ranked, paginated, or truncated. However, it is not hard to find answers to questions like "which senator is interested in a given topic or what a given senator thinks about a given topic."

## 2. Search by speaker. 

Correct spelling of the first name or last name is required. 

## 3. Removal of results that are not useful. 

Shown in context, the removed result might be very useful, but showing the context is not yet supported.

## 4. Creating triples.

The subject must have the last name of a senator as the last token. Otherwise, the image link generation might not work. Two senators with the same last name will also cause problems when showing results.

## 5. Loading triples to the server.

Regarding the graph "ozpol", existing or previously loaded triples are always overwritten. In a real, multiuser environment, and when the system is stable, merging would be the way to go.

