from bs4 import BeautifulSoup
import os

IMAGE_BASE_DIR_150 = '150/'
IMAGE_BASE_DIR_800 = '800/'
IMAGE_BASE_SRCSET = 'avif/'
INPUT_FILE = 'index.html'

with open(INPUT_FILE, 'r') as file:
    soup = BeautifulSoup(file, 'html.parser')

# Change index (modified divs)
noscript_content = ""
counter_dict = {}
div_ids = []  # Store div IDs for links
for div in soup.find_all(lambda tag: tag.name == 'div' and tag.get('id'))[:4]:
    div_id = div.get('id')
    div_ids.append(div_id)  # Add div ID to the list
    if div_id not in counter_dict:
        counter_dict[div_id] = 1
    for img in div.find_all('img'):
        img_src = img['src'].replace(IMAGE_BASE_DIR_150, '')
        img_base, _ = os.path.splitext(img_src)
        img['src'] = os.path.join(IMAGE_BASE_DIR_150, img_src)
        img['srcset'] = os.path.join(IMAGE_BASE_SRCSET, IMAGE_BASE_DIR_150, f"{img_base}.avif")
        img['alt'] = f"{div_id.replace('paintings', 'painting').replace('drawings', 'drawing')} {counter_dict[div_id]} by Kevin Larmee"        
        img['title'] = ''
        a_tag = img.find_parent('a')
        if a_tag:
            a_tag['href'] = f'{div_id}/{counter_dict[div_id]}.html'
        else:
            a_tag = soup.new_tag('a')
            a_tag['href'] = f'{div_id}/{counter_dict[div_id]}.html'
            img.wrap(a_tag)
        counter_dict[div_id] += 1
    noscript_content += str(div)

with open(INPUT_FILE, 'w') as file:
    file.write(str(soup))

# Generate links HTML
links_html = ''
for div_id in div_ids:
    links_html += f'<a href="{div_id}">{div_id}</a><br>'

# Make dirs
for div in soup.find_all(lambda tag: tag.name == 'div' and tag.get('id'))[:4]:
    div_id = div.get('id')
    os.makedirs(div_id, exist_ok=True)

    for h2 in div.find_all('h2'):
        h2.decompose()

    div_content_html = div.decode_contents()
    div_content_soup = BeautifulSoup(div_content_html, 'html.parser')

    for img in div_content_soup.find_all('img'):
        parent_a_tag = img.find_parent('a')
        if parent_a_tag:
            href = parent_a_tag['href']
            parent_a_tag['href'] = os.path.basename(href)
        img_src = os.path.basename(img['src'])
        img_base, _ = os.path.splitext(img_src)
        img['src'] = os.path.join('../', IMAGE_BASE_DIR_150, img_src)
        img['srcset'] = f"../{IMAGE_BASE_SRCSET}{IMAGE_BASE_DIR_150}{img_base}.avif"

    div_ids = [d.get('id') for d in soup.find_all(lambda tag: tag.name == 'div' and tag.get('id'))[:4] if d.get('id') != div_id]
    links_html = ' | '.join([f'<a href="../{other_div_id}">{other_div_id}</a>' for other_div_id in div_ids])

    # --- MODIFIED SECTION STARTS HERE ---
    
    # Check if the div_id is 'paintings'
    if div_id == 'paintings':
        html_content = f"""
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Kevin Larmee {div_id}</title>
    </head>
    <body>
        <h1><a href="../index.html" style="text-decoration:none;color:#000000">Kevin Larmee</a></h1>
        <h2>{div_id}</h2>
        <details open="true">
            <summary>images</summary>
            {str(div_content_soup)}
        </details>
        <br>
        <details>
            <summary>info</summary>
            <ol><li>Protest, oil on canvas, 20x20"</li><li>Street Scene (Night), oil on canvas, 24x24"</li><li>No War, oil on canvas, 24x24"</li><li>Park Bench, oil on canvas, 20x20"</li><li>Street Scene (Night), oil on canvas, 20x20"</li><li>Run, oil on canvas, 24x24"</li><li>Arcade, oil on canvas, 24x24"</li><li>Rooftop Nude, oil on canvas, 20x20"</li><li>At the Gallery, oil on canvas, 20x20"</li><li>Dance, oil on canvas, 24x24"</li><li>Gallery Jazz, oil on canvas, 24x24"</li><li>Party, acrylic on canvas, 24x24"</li><li>Party, oil on canvas, 24x24"</li><li>Gallery Jazz, oil on canvas, 24x24"</li><li>Trio, oil on canvas, 24x24"</li><li>Silver Bowl, oil on canvas, 20x20"</li><li>Sea and Gulls (part of tritych), oil on canvas, 24x24"</li><li>Protest, oil on canvas, 20x20"</li><li>Dandelions, oil on canvas, 20x20"</li><li>Branches and Night Sky, oil on canvas, 24x24"</li><li>Park Path, oil on canvas, 20x20"</li><li>Car, oil on canvas, 24x24"</li><li>Boxing, oil on canvas, 28x28"</li><li>Dance, oil on canvas, 24x24"</li><li>Chair, oil on canvas, 28x28"</li><li>Cafe, oil on canvas, 20x20"</li><li>Dinner Party, oil on canvas, 20x20"</li><li>Cafe, oil on canvas, 20x20"</li><li>Beach, oil on canvas, 24x24"</li><li>Yellow Cafe, oil on canvas, 20x20"</li><li>Party, oil on canvas, 28x28"</li><li>Dandelions, oil on canvas, 20x20"</li><li>Yellow Sky with Autumn Tree, oil on canvas, 20x20"</li><li>Dance, oil on canvas, 20x20"</li><li>Trees, oil on canvas, 24x24"</li><li>Dance, oil on canvas, 20x20"</li><li>Rock Concert, oil on canvas, 20x20"</li><li>At the Gallery, oil on canvas, 20x20"</li><li>Branches and Sky, oil on canvas, 24x24"</li><li>Autumn, oil on canvas, 20x20"</li><li>Light on the Pier, oil on canvas, 20x20"</li><li>Yellow Sky Abstracted Field, oil on canvas, 20x20"</li><li>Night Swim, oil on canvas, 20x20"</li><li>Lost in the Cafe, oil on canvas, 20x20"</li><li>Gallery Jazz, oil on canvas, 24x24"</li><li>Kitchen, acrylic on canvas, 24x24"</li><li>Water, oil on canvas, 24x24"</li><li>Rooftop Pool, oil on canvas, 24x24"</li><li>Dance, oil on canvas, 24x24"</li><li>Car, oil on canvas, 24x24"</li><li>At the Gallery, oil on canvas, 20x20"</li><li>At the Gallery, oil on canvas, 20x20"</li><li>Boxing, oil on canvas, 28x28"</li><li>Boxing, oil on canvas, 28x28"</li><li>Opera, oil on canvas, 24x24"</li><li>Yellow Sky and Tree, oil on canvas, 20x20"</li><li>Indoor Pool, oil on canvas, 24x24"</li><li>Ocean, oil on canvas, 20x20"</li><li>Beach, oil on canvas, 20x20"</li><li>Yellow Sky and Black Trees, oil on canvas, 20x20"</li><li>Hose, oil on canvas, 24x24"</li><li>Boxing, oil on canvas, 28x28"</li><li>Rain, oil on canvas, 28x28"</li><li>Boxing, oil on canvas, 28x28"</li><li>Gallery, oil on canvas, 24x24"</li><li>At the Museum, oil on canvas, 24x24"</li><li>Dance, oil on canvas, 24x24"</li><li>At the Gallery, oil on canvas, 20x20"</li><li>Boy with Dog, oil on canvas, 20x20"</li><li>Party, oil on canvas, 24x24"</li><li>Wedding Reception, oil on canvas, 24x24"</li><li>Museum Love Story, oil on canvas, 28x28"</li><li>Waterfront, oil on canvas, 28x28"</li><li>Riverside Park and Pan, oil on canvas, 28x28"</li><li>Street (Night), oil on canvas, 24x24"</li><li>Yellow Restaurant, oil on canvas, 20x20"</li><li>Indoor Pool, oil on canvas, 24x24"</li><li>Boy Facing the Trees, oil on canvas, 20x20"</li><li>Light, oil on canvas, 24x24"</li><li>Lost in the Cafe, oil on canvas, 28x28"</li><li>Party (Symposium), oil on canvas, 24x24"</li><li>Party, oil on canvas, 24x24"</li><li>At the Gallery, oil on canvas, 24x24"</li><li>Party, oil on canvas, 24x24"</li><li>At the Gallery, oil on canvas, 20x20"</li><li>Yellow Trees, oil on canvas, 20x20"</li><li>Yellow Car, oil on canvas, 20x20"</li><li>Alexander &amp; Bucephalus, oil on canvas, 24x24"</li><li>Dance, oil on canvas, 24x24"</li><li>Party, oil on canvas, 24x24"</li></ol>
        </details>
    </body>
    </html>
    """
    else:
        # This is the original logic for all other divs
        html_content = f"""
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Kevin Larmee 2</title>
    </head>
    <body>
        <h1><a href="../index.html" style="text-decoration:none;color:#000000">Kevin Larmee</a></h1>
        <h2>{div_id}</h2>
        {str(div_content_soup)}
    </body>
    </html>
    """
    # --- MODIFIED SECTION ENDS HERE ---


    with open(os.path.join(div_id, 'index.html'), 'w') as file:
        file.write(html_content)

# Make image pages
for div in soup.find_all(lambda tag: tag.name == 'div' and tag.get('id'))[:4]:
    div_id = div.get('id')
    img_counter = 1
    for img in div.find_all('img'):
        img_src = os.path.basename(img['src'])
        img_base, _ = os.path.splitext(img_src)

        img_tag = soup.new_tag('img')
        img_tag['src'] = f"../hi/{img_src}"
        img_tag['width'] = f"800"
        img_tag['srcset'] = f"../{IMAGE_BASE_SRCSET}hi/{img_base}.avif"

        a_tag = soup.new_tag('a')
        a_tag['href'] = f"../hi/{img_src}"
        a_tag.append(img_tag)

        links_html = ''
        links_html += f'<h2><a href="index.html" style="text-decoration:none;color:#000000">{div_id}</a></h2> | '
        if img_counter > 1:
            links_html += f'<a href="{img_counter-1}.html">Previous</a> | '
        links_html += f'{img_counter} | '
        if img_counter < len(div.find_all('img')):
            links_html += f'<a href="{img_counter+1}.html">Next</a>'

        new_page_html = f"""
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Kevin Larmee {div_id} {img_counter}</title>
        </head>
        <body>
            <h1><a href="../index.html" style="text-decoration:none;color:#000000">Kevin Larmee</a></h1>
            {links_html}
            <script src="../nav.js"></script>
            <br>
            {a_tag}
        </body>
        </html>
        """

        os.makedirs(div_id, exist_ok=True)
        with open(os.path.join(div_id, f'{img_counter}.html'), 'w') as file:
            file.write(new_page_html)
        img_counter += 1
