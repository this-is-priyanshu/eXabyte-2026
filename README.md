# eXabyte-2026

eXabyte-2026 Website Development


## Building html files (subject to change)

**Problem:** HTML is not good for modular development, so either we delegate a large portion
of the job to client side, which is not good for performance and results in a lot of JS being
transmitted over the wire.

**Solution:** We prerender the HTML that can be pre-rendered, and to achieve this we use a templating
engine. We are testing out jinja seems to a solid templating engine. For the content portion
we are using HJSON. And at the end we are prettyfing the output using BeautifulSoup.

**Building Workflow:**
- All the html files are kept in the 'templates' directory
- Any component of the html that can be reused is kept in the 'templates/components' directory
- All CSS and JS is stored in the static directory and the linking happens are normal html
- The content of the site is kept in the 'content' directory.
- After building out the html files, we have to run build.py which will compile all the changes and put them in the 'dist' directory.

We will ensure that at all times the dist directory is in a position that it can shipped.
