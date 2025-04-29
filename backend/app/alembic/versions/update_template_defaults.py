"""update template defaults

Revision ID: update_template_defaults
Revises: previous_revision
Create Date: 2024-03-03 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'update_template_defaults'
down_revision = '48724fedc149'  # ID предыдущей миграции
branch_labels = None
depends_on = None

def upgrade():
    # Обновляем существующие записи
    op.execute("UPDATE templates SET is_template = false WHERE is_template IS NULL")
    op.execute("UPDATE templates SET variables = '[]'::jsonb WHERE variables IS NULL")

def downgrade():
    # Откат изменений не требуется
    pass 