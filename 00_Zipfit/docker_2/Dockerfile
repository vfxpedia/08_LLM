FROM postgres:14

# Install pgvector extension
RUN apt-get update && \
    apt-get install -y postgresql-14-pgvector && \
    rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV POSTGRES_DB=skn19_3rd_proj
ENV POSTGRES_USER=rag_user
ENV POSTGRES_PASSWORD=rag_password

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD pg_isready -U $POSTGRES_USER -d $POSTGRES_DB || exit 1
