from alembic import op
import sqlalchemy as sa

revision = "20260923_04"
down_revision = "20260923_03"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "characters",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("user_id", sa.String(36), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("name", sa.String(80), nullable=False),
        sa.Column("data", sa.JSON(), nullable=False),
    )
    op.create_index("ix_characters_user_id", "characters", ["user_id"])
    op.create_table(
        "decks",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("user_id", sa.String(36), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("name", sa.String(80), nullable=False),
        sa.Column("side", sa.String(16), nullable=False),
        sa.Column("class_id", sa.String(50), nullable=True),
        sa.Column("card_ids", sa.JSON(), nullable=False),
    )
    op.create_index("ix_decks_user_id", "decks", ["user_id"])


def downgrade() -> None:
    op.drop_index("ix_decks_user_id", table_name="decks")
    op.drop_table("decks")
    op.drop_index("ix_characters_user_id", table_name="characters")
    op.drop_table("characters")
