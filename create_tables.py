from db import Base, engine

# Hamorona table vaovao mifanaraka amin'ny model
Base.metadata.create_all(engine)
print("Table 'candidatures' created successfully!")
