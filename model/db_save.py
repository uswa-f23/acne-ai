import psycopg2

def save_result(user_id, image_path, acne_type, severity, severity_score):
    conn = psycopg2.connect(
        dbname="acneai_db",
        user="postgres",
        password="urwa",
        host="localhost",
        port="5432"
    )

    cur = conn.cursor()
    cur.execute(
        """
        INSERT INTO acne_analysis
        (user_id, image_path, acne_type, severity, severity_score)
        VALUES (%s, %s, %s, %s, %s)
        """,
        (user_id, image_path, acne_type, severity, severity_score)
    )

    conn.commit()
    cur.close()
    conn.close()
