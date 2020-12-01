import pdfkit as pdf
import os, platform, subprocess

def get_pdfkit_config():
     """wkhtmltopdf lives and functions differently depending on Windows or Linux. We
      need to support both since we develop on windows but deploy on Heroku.

     Returns:
         A pdfkit configuration
     """
     if platform.system() == 'Windows':
         return pdf.configuration(wkhtmltopdf=os.environ.get('WKHTMLTOPDF_BINARY', 'C:\\Program Files\\wkhtmltopdf\\bin\\wkhtmltopdf.exe'))
     else:
         WKHTMLTOPDF_CMD = subprocess.Popen(['which', os.environ.get('WKHTMLTOPDF_BINARY', 'wkhtmltopdf')], stdout=subprocess.PIPE).communicate()[0].strip()
         return pdf.configuration(wkhtmltopdf=WKHTMLTOPDF_CMD)
def create_pdf(html, username):
    css = 'static/style.css'
    pdf.from_string(html, f"wishlists/{username}.pdf", css=css)


def delete_pdf(path):
    os.remove(path)

