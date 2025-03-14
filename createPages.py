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
# Write noscript.html
with open('noscript.html', 'w') as file:
    file.write(f"""
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Kevin Larmee</title>
    </head>
    <body>
    <h1>Kevin Larmee</h1>
        <a href="index.html">rich index</a><br>
        html index<br>
        {links_html}
    </body>
    </html>
    """)


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

    html_content = f"""
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Kevin Larmee {div_id}</title>
    </head>
    <body>
        <a href="../noscript.html">Kevin Larmee</a> | {links_html}
        <h1>{div_id}</h1>
        {str(div_content_soup)}
    </body>
    </html>
    """

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
        img_tag['src'] = f"../{IMAGE_BASE_DIR_800}{img_src}"
        img_tag['srcset'] = f"../{IMAGE_BASE_SRCSET}{IMAGE_BASE_DIR_800}{img_base}.avif"

        a_tag = soup.new_tag('a')
        a_tag['href'] = f"../hi/{img_src}"
        a_tag.append(img_tag)

        links_html = ''
        links_html += f'<a href="index.html">{div_id}</a> | '
        if img_counter > 1:
            links_html += f'<a href="{img_counter-1}.html">Previous</a> | '
        links_html += f'{img_counter} | '
        if img_counter < len(div.find_all('img')):
            links_html += f'<a href="{img_counter+1}.html">Next</a>'

        new_page_html = f"""
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Kevin Larmee {div_id} {img_counter}</title>
        </head>
        <body>
            <a href="../noscript.html">Kevin Larmee</a> | {links_html}<br>
            {a_tag}
        </body>
        </html>
        """

        os.makedirs(div_id, exist_ok=True)
        with open(os.path.join(div_id, f'{img_counter}.html'), 'w') as file:
            file.write(new_page_html)
        img_counter += 1
