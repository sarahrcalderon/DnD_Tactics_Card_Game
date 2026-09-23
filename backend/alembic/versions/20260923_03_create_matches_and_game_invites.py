from alembic import op
import sqlalchemy as sa

revision = "20260923_03"
down_revision = "20260923_02"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "matches",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("status", sa.String(length=16), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("started_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("finished_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("winner_side", sa.String(length=16), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "match_players",
        sa.Column("match_id", sa.String(length=36), nullable=False),
        sa.Column("user_id", sa.String(length=36), nullable=False),
        sa.Column("side", sa.String(length=16), nullable=False),
        sa.Column("slot", sa.Integer(), nullable=False),
        sa.Column("ready", sa.Boolean(), nullable=False),
        sa.Column("connected", sa.Boolean(), nullable=False),
        sa.Column("character_id", sa.String(length=36), nullable=True),
        sa.Column("deck_id", sa.String(length=36), nullable=True),
        sa.ForeignKeyConstraint(["match_id"], ["matches.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("match_id", "user_id"),
        sa.UniqueConstraint("match_id", "slot", name="uq_match_players_match_slot"),
    )
    op.create_table(
        "game_invites",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("match_id", sa.String(length=36), nullable=False),
        sa.Column("sender_id", sa.String(length=36), nullable=False),
        sa.Column("receiver_id", sa.String(length=36), nullable=False),
        sa.Column("side", sa.String(length=16), nullable=False),
        sa.Column("status", sa.String(length=16), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("responded_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["match_id"], ["matches.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["receiver_id"], ["users.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["sender_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_game_invites_match_id", "game_invites", ["match_id"], unique=False)
    op.create_index("ix_game_invites_receiver_id", "game_invites", ["receiver_id"], unique=False)
    op.create_index("ix_game_invites_sender_id", "game_invites", ["sender_id"], unique=False)
    op.create_index("ix_game_invites_status", "game_invites", ["status"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_game_invites_status", table_name="game_invites")
    op.drop_index("ix_game_invites_sender_id", table_name="game_invites")
    op.drop_index("ix_game_invites_receiver_id", table_name="game_invites")
    op.drop_index("ix_game_invites_match_id", table_name="game_invites")
    op.drop_table("game_invites")
    op.drop_table("match_players")
    op.drop_table("matches")
