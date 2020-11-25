import pdfkit as pdf
import os


def create_pdf(html, username):
    css = 'static/style.css'
    pdf.from_string(html, f"wishlists/{username}.pdf", css=css)


def delete_pdf(path):
    os.remove(path)

