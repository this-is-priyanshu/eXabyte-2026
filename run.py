import os
import time
import threading
import hjson
import sys

from flask import Flask, abort, send_from_directory
from flask_hot_reload import HotReload
from jinja2 import Environment, FileSystemLoader, meta

from pathlib import Path

from build import ROOT_DIR, COMPONENTS_CONTENT_DIR, PAGES_CONTENT_DIR, TEMPLATES_DIR, convert_to_json

# Abusing app's 
app = Flask(__name__, static_folder=ROOT_DIR, template_folder=PAGES_CONTENT_DIR)
env = Environment(loader = FileSystemLoader(TEMPLATES_DIR), autoescape=False)

hot_reload = HotReload(app, includes = list(map(lambda k: os.path.join(ROOT_DIR, k), [ 'content', 'templates', 'static', 'assets' ])))

# If html files are read, we need to render stuff
@app.route("/", defaults={'path':'index.html'})
@app.route("/<path>")
def route_html_files(path):

    try:
        actual_path = (Path(path).stem, os.path.join(PAGES_CONTENT_DIR, path).replace('html', 'hjson'))
        components_to_update = []

        with open(os.path.join(TEMPLATES_DIR, path)) as f:
            src = f.read()
            ast = env.parse(src)
            dep = meta.find_referenced_templates(ast)

            components_to_update = [ (Path(i).stem, os.path.join(PAGES_CONTENT_DIR, i.replace('html', 'hjson'))) for i in dep ]

        for d in components_to_update:
            with open(d[1]) as f:
                components_data[ d[0] ] = hjson.load(f)
                env.globals[ d[0] ] = components_data[ d[0] ]

        if os.path.exists(actual_path[1]):
            with open(actual_path[1]) as f:
                pages_data[ actual_path[0] ] = hjson.load(f)
        else:
            pages_data[ actual_path[0] ] = {}

        template = env.get_template(path)
        return template.render(pages_data[ Path(path).stem ])

    except Exception as e:
        print(e)
        return abort(404)

# Route the static files
@app.route("/static/<path:path>")
def route_static_files(path):
    folder = os.path.join(ROOT_DIR, 'static')
    return send_from_directory(folder, path)

@app.route("/assets/<path:path>")
def route_assets_files(path):
    folder = os.path.join(ROOT_DIR, 'assets')
    return send_from_directory(folder, path)


# First get all the json data
components_data = convert_to_json(COMPONENTS_CONTENT_DIR)
pages_data = convert_to_json(PAGES_CONTENT_DIR)

for k, v in components_data.items():
    env.globals[k] = v

app.run()
