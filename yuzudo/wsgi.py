"""
WSGI config for yuzudo project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

# WEBSITE_HOSTNAME is a default environment variable generated in Azure App Service
# If it exists, then we are running in Azure App Service
# Otherwise, we are running locally
settings_module = 'yuzudo.deployment' if 'WEBSITE_HOSTNAME' in os.environ else 'yuzudo.settings'
os.environ.setdefault('DJANGO_SETTINGS_MODULE', settings_module)

application = get_wsgi_application()
