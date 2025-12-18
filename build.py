import os
import shutil

# For reading contents
import hjson

# For Converting hjson into jinja
from jinja2 import Environment, FileSystemLoader
from pathlib import Path

# For prettyfying bad looking html so that if things go wrong we can ateleast read the dist
from bs4 import BeautifulSoup

ROOT_DIR = os.path.dirname(__file__)

# Contents dir
COMPONENTS_CONTENT_DIR = os.path.join(ROOT_DIR, 'content', 'components')
PAGES_CONTENT_DIR = os.path.join(ROOT_DIR, 'content')

# Templates dir
TEMPLATES_DIR = os.path.join(ROOT_DIR, 'templates')
STATIC_DIR = os.path.join(ROOT_DIR, 'static')
ASSETS_DIR = os.path.join(ROOT_DIR, 'assets')

def convert_to_json(dir):
    processed = {}
    for f in os.listdir(dir):
        path = os.path.join(dir, f)
        if os.path.isfile(path):
            with open(path) as k:
                actual = Path(f)
                processed[actual.stem] = hjson.load(k)
    return processed

def main():
    # First get all the json data
    components_data = convert_to_json(COMPONENTS_CONTENT_DIR)
    pages_data = convert_to_json(PAGES_CONTENT_DIR)

    # Now we do jinja stuff
    env = Environment(loader = FileSystemLoader(TEMPLATES_DIR),
            autoescape=False)

    for k, v in components_data.items():
        env.globals[k] = v


    # We build out everything to the dist directory
    PROD = os.path.join(ROOT_DIR, 'dist')

    shutil.rmtree(PROD)
    os.makedirs(PROD)
    shutil.copytree(ASSETS_DIR, os.path.join(PROD, 'assets'))
    shutil.copytree(STATIC_DIR, os.path.join(PROD, 'static'))

    for k, v in pages_data.items():

        # we are only templating html files
        p = k + '.html'
        template = env.get_template(p)
        html = template.render(v)

        # prettying output
        html = BeautifulSoup(html, 'html.parser').prettify()

        # rendering the file
        rendered_html = os.path.join(PROD, p)
        with open(rendered_html, mode='w') as f:
            f.write(html)

if __name__ == '__main__':
    main()
