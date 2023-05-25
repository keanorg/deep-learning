import os
import imagehash
from PIL import Image

def find_duplicates(directory):
    hash_dict = {}
    duplicates = []

    for dirpath, dirnames, filenames in os.walk(directory):
        for filename in filenames:
            file_path = os.path.join(dirpath, filename)
            try:
                image = Image.open(file_path)
                image_hash = imagehash.phash(image)
            except IOError:
                # Pas une image
                continue

            if image_hash in hash_dict:
                print(f'Duplicate found: {file_path} is a duplicate of {hash_dict[image_hash]}')
                duplicates.append(file_path)
            else:
                hash_dict[image_hash] = file_path

    return duplicates

def delete_files(file_paths):
    for file_path in file_paths:
        os.remove(file_path)

directory = 'images/talon'  # Remplacer par votre dossier
duplicates = find_duplicates(directory)

# Décommentez cette ligne si vous voulez supprimer les doublons automatiquement
# Attention: une fois supprimés, les fichiers ne peuvent pas être récupérés
delete_files(duplicates)
