from app import create_app, db
from app.services import facade

app = create_app()


def seed_demo_data():
    with app.app_context():
        from app.models.place_image import PlaceImage

        db.drop_all()
        db.create_all()

        shared_password = "Test1234!"

        # -------------------------
        # Users
        # -------------------------
        users_data = [
            {
                "key": "antoine",
                "first_name": "Antoine",
                "last_name": "Gousset",
                "email": "antoine.gousset@hbnb.test",
                "password": shared_password,
                "is_admin": True,
            },
            {
                "key": "Léa",
                "first_name": "Léa",
                "last_name": "Gousset",
                "email": "Léa.gousset@hbnb.test",
                "password": shared_password,
                "is_admin": False,
            },
            {
                "key": "sebastien",
                "first_name": "Sebastien",
                "last_name": "Vallier",
                "email": "sebastien.vallier@hbnb.test",
                "password": shared_password,
                "is_admin": False,
            },
            {
                "key": "patricia",
                "first_name": "Patricia",
                "last_name": "Le Brun",
                "email": "patricia.lebrun@hbnb.test",
                "password": shared_password,
                "is_admin": False,
            },
            {
                "key": "benjy",
                "first_name": "Benjy",
                "last_name": "Guerin",
                "email": "benjy.guerin@hbnb.test",
                "password": shared_password,
                "is_admin": False,
            },
            {
                "key": "micael",
                "first_name": "Micael",
                "last_name": "Magalhaes Pinho",
                "email": "micael.pinho@hbnb.test",
                "password": shared_password,
                "is_admin": False,
            },
            {
                "key": "melissandre",
                "first_name": "Melissandre",
                "last_name": "Moreau",
                "email": "melissandre.moreau@hbnb.test",
                "password": shared_password,
                "is_admin": False,
            },
            {
                "key": "brice",
                "first_name": "Brice",
                "last_name": "Travers",
                "email": "brice.travers@hbnb.test",
                "password": shared_password,
                "is_admin": False,
            },
        ]

        users = {}
        for user_data in users_data:
            created_user = facade.create_user(
                {
                    "first_name": user_data["first_name"],
                    "last_name": user_data["last_name"],
                    "email": user_data["email"],
                    "password": user_data["password"],
                    "is_admin": user_data["is_admin"],
                }
            )
            users[user_data["key"]] = created_user

        # -------------------------
        # Amenities
        # -------------------------
        amenity_names = [
            "WiFi",
            "Parking",
            "Sea View",
            "City View",
            "Mountain View",
            "Spa",
            "Hot Tub",
            "Fireplace",
            "Workspace",
            "Garden",
            "Balcony",
            "Breakfast",
            "Air Conditioning",
            "Heating",
            "Kitchen",
            "Washer",
            "TV",
            "Pool",
            "Pet Friendly",
            "Self Check-in",
            "Beach Access",
            "BBQ",
            "Elevator",
            "Accessible",
            "EV Charger",
        ]

        amenities = {}
        for name in amenity_names:
            amenities[name] = facade.create_amenity({"name": name})

        # -------------------------
        # Places
        # -------------------------
        places_data = [
            {
                "key": "rennes_loft",
                "title": "Rennes City Center Loft",
                "description": "A bright and elegant loft in the heart of Rennes, ideal for a premium city break with easy access to restaurants, shops, and cultural spots.",
                "price": 110,
                "latitude": 48.1113,
                "longitude": -1.6800,
                "owner": "micael",
                "amenities": [
                    "WiFi",
                    "Workspace",
                    "Air Conditioning",
                    "Heating",
                    "Kitchen",
                    "TV",
                    "Washer",
                    "Balcony",
                    "Self Check-in",
                ],
            },
            {
                "key": "saint_malo_studio",
                "title": "Cozy Saint-Malo Studio",
                "description": "A warm and practical studio near the beach and the old town, perfect for a romantic weekend or a short coastal stay.",
                "price": 75,
                "latitude": 48.6493,
                "longitude": -2.0257,
                "owner": "brice",
                "amenities": [
                    "WiFi",
                    "Breakfast",
                    "Kitchen",
                    "TV",
                    "Heating",
                    "Beach Access",
                    "Self Check-in",
                ],
            },
            {
                "key": "cancale_house",
                "title": "Sea View House in Cancale",
                "description": "A spacious house with panoramic sea views, designed for peaceful stays, family gatherings, and refined comfort by the coast.",
                "price": 250,
                "latitude": 48.6740,
                "longitude": -1.8529,
                "owner": "sebastien",
                "amenities": [
                    "WiFi",
                    "Parking",
                    "Sea View",
                    "Garden",
                    "Fireplace",
                    "Kitchen",
                    "TV",
                    "BBQ",
                    "Pet Friendly",
                ],
            },
            {
                "key": "vannes_apartment",
                "title": "Chic Apartment in Vannes",
                "description": "A stylish apartment with modern decor, premium comfort, and a calm atmosphere, just minutes from the historic center of Vannes.",
                "price": 140,
                "latitude": 47.6582,
                "longitude": -2.7608,
                "owner": "patricia",
                "amenities": [
                    "WiFi",
                    "Workspace",
                    "Balcony",
                    "Air Conditioning",
                    "Heating",
                    "Kitchen",
                    "TV",
                    "Washer",
                    "City View",
                    "Elevator",
                ],
            },
            {
                "key": "broceliande_cabin",
                "title": "Nature Cabin in Broceliande",
                "description": "A charming cabin surrounded by nature, offering a cozy retreat for guests looking for silence, forest views, and a unique escape.",
                "price": 85,
                "latitude": 48.0108,
                "longitude": -2.2017,
                "owner": "melissandre",
                "amenities": [
                    "WiFi",
                    "Garden",
                    "Fireplace",
                    "Breakfast",
                    "Heating",
                    "Kitchen",
                    "Pet Friendly",
                    "Mountain View",
                    "BBQ",
                ],
            },
            {
                "key": "dinard_villa",
                "title": "Dinard Spa Villa",
                "description": "A luxurious villa with spa facilities, generous volumes, and a high-end ambiance for an exceptional seaside experience.",
                "price": 300,
                "latitude": 48.6329,
                "longitude": -2.0625,
                "owner": "Léa",
                "amenities": [
                    "WiFi",
                    "Parking",
                    "Spa",
                    "Hot Tub",
                    "Garden",
                    "Pool",
                    "Air Conditioning",
                    "Kitchen",
                    "TV",
                    "Beach Access",
                ],
            },
            {
                "key": "chambord_suite",
                "title": "Royal Suite at Chambord Castle",
                "description": "An exclusive and prestigious suite inspired by French heritage, created for unforgettable luxury stays in a remarkable setting.",
                "price": 500,
                "latitude": 47.6160,
                "longitude": 1.5160,
                "owner": "antoine",
                "amenities": [
                    "WiFi",
                    "Breakfast",
                    "Spa",
                    "Balcony",
                    "Air Conditioning",
                    "Heating",
                    "TV",
                    "Elevator",
                    "Accessible",
                ],
            },
            {
                "key": "betton_room",
                "title": "Betton Room",
                "description": "A simple, clean, and affordable room for short stays, business travel, or practical overnight stops near Rennes.",
                "price": 45,
                "latitude": 48.1818,
                "longitude": -1.6415,
                "owner": "benjy",
                "amenities": [
                    "WiFi",
                    "Workspace",
                    "Parking",
                    "Heating",
                    "TV",
                    "Self Check-in",
                    "EV Charger",
                ],
            },
        ]

        places = {}
        for place_data in places_data:
            created_place = facade.create_place(
                {
                    "title": place_data["title"],
                    "description": place_data["description"],
                    "price": place_data["price"],
                    "latitude": place_data["latitude"],
                    "longitude": place_data["longitude"],
                    "owner_id": users[place_data["owner"]].id,
                    "amenities": [amenities[name].id for name in place_data["amenities"]],
                }
            )
            places[place_data["key"]] = created_place

        # -------------------------
        # Images (3 per place)
        # -------------------------
        place_images_data = {
            "rennes_loft": [
                "hbnb/images/places/rennes-loft-1.jpg",
                "hbnb/images/places/rennes-loft-2.jpg",
                "hbnb/images/places/rennes-loft-3.jpg",
            ],
            "saint_malo_studio": [
                "hbnb/images/places/saint-malo-studio-1.jpg",
                "hbnb/images/places/saint-malo-studio-2.jpg",
                "hbnb/images/places/saint-malo-studio-3.jpg",
            ],
            "cancale_house": [
                "hbnb/images/places/cancale-house-1.jpg",
                "hbnb/images/places/cancale-house-2.jpg",
                "hbnb/images/places/cancale-house-3.jpg",
            ],
            "vannes_apartment": [
                "hbnb/images/places/vannes-apartment-1.jpg",
                "hbnb/images/places/vannes-apartment-2.jpg",
                "hbnb/images/places/vannes-apartment-3.jpg",
            ],
            "broceliande_cabin": [
                "hbnb/images/places/broceliande-cabin-1.jpg",
                "hbnb/images/places/broceliande-cabin-2.jpg",
                "hbnb/images/places/broceliande-cabin-3.jpg",
            ],
            "dinard_villa": [
                "hbnb/images/places/dinard-villa-1.jpg",
                "hbnb/images/places/dinard-villa-2.jpg",
                "hbnb/images/places/dinard-villa-3.jpg",
            ],
            "chambord_suite": [
                "hbnb/images/places/chambord-suite-1.jpg",
                "hbnb/images/places/chambord-suite-2.jpg",
                "hbnb/images/places/chambord-suite-3.jpg",
            ],
            "betton_room": [
                "hbnb/images/places/betton-room-1.jpg",
                "hbnb/images/places/betton-room-2.jpg",
                "hbnb/images/places/betton-room-3.jpg",
            ],
        }

        for place_key, image_urls in place_images_data.items():
            for image_url in image_urls:
                db.session.add(PlaceImage(url=image_url, place=places[place_key]))

        db.session.commit()

        # -------------------------
        # Reviews (3 per place)
        # -------------------------
        reviews_data = [
            # Rennes City Center Loft (owner: micael)
            {
                "user": "antoine",
                "place": "rennes_loft",
                "rating": 5,
                "text": "Excellent location, elegant decor, and a very comfortable stay. Everything felt premium and well thought out.",
            },
            {
                "user": "Léa",
                "place": "rennes_loft",
                "rating": 4,
                "text": "Very stylish loft with a great atmosphere. A little lively outside at night, but still a very good experience.",
            },
            {
                "user": "patricia",
                "place": "rennes_loft",
                "rating": 5,
                "text": "Beautiful loft in the city center, spotless and easy to access. I would definitely stay here again.",
            },

            # Cozy Saint-Malo Studio (owner: brice)
            {
                "user": "antoine",
                "place": "saint_malo_studio",
                "rating": 4,
                "text": "Small but very well organized. Great for a short stay near the sea and the old town.",
            },
            {
                "user": "melissandre",
                "place": "saint_malo_studio",
                "rating": 5,
                "text": "Lovely and cozy studio, perfect for two people. The location made everything easy and enjoyable.",
            },
            {
                "user": "benjy",
                "place": "saint_malo_studio",
                "rating": 4,
                "text": "Very practical and pleasant place. Good value for money and a warm atmosphere.",
            },

            # Sea View House in Cancale (owner: sebastien)
            {
                "user": "patricia",
                "place": "cancale_house",
                "rating": 5,
                "text": "The sea view is absolutely stunning. Spacious, quiet, and perfect for a relaxing coastal getaway.",
            },
            {
                "user": "micael",
                "place": "cancale_house",
                "rating": 4,
                "text": "Beautiful property with a peaceful atmosphere. The kitchen could be better equipped, but overall excellent.",
            },
            {
                "user": "Léa",
                "place": "cancale_house",
                "rating": 5,
                "text": "A truly relaxing house with an amazing view. It felt refined, spacious, and very comfortable.",
            },

            # Chic Apartment in Vannes (owner: patricia)
            {
                "user": "brice",
                "place": "vannes_apartment",
                "rating": 5,
                "text": "Modern, elegant, and very comfortable. The apartment was spotless and beautifully decorated.",
            },
            {
                "user": "benjy",
                "place": "vannes_apartment",
                "rating": 4,
                "text": "Very nice apartment with a calm and stylish atmosphere. Great base for visiting Vannes.",
            },
            {
                "user": "micael",
                "place": "vannes_apartment",
                "rating": 4,
                "text": "Clean, bright, and well located. The decor gives the place a refined and welcoming character.",
            },

            # Nature Cabin in Broceliande (owner: melissandre)
            {
                "user": "sebastien",
                "place": "broceliande_cabin",
                "rating": 5,
                "text": "A peaceful and unique cabin surrounded by nature. Ideal for disconnecting and slowing down.",
            },
            {
                "user": "Léa",
                "place": "broceliande_cabin",
                "rating": 4,
                "text": "Warm and charming place with a beautiful natural setting. Very relaxing and cozy.",
            },
            {
                "user": "antoine",
                "place": "broceliande_cabin",
                "rating": 5,
                "text": "Excellent experience in the forest. Quiet, original, and perfect for a restful weekend.",
            },

            # Dinard Spa Villa (owner: Léa)
            {
                "user": "antoine",
                "place": "dinard_villa",
                "rating": 5,
                "text": "A high-end villa with outstanding comfort. The spa area made the stay feel truly special.",
            },
            {
                "user": "brice",
                "place": "dinard_villa",
                "rating": 5,
                "text": "Spacious, elegant, and perfectly maintained. One of the best premium stays I have had.",
            },
            {
                "user": "patricia",
                "place": "dinard_villa",
                "rating": 4,
                "text": "Very beautiful villa with excellent amenities. The spa and overall ambiance were top quality.",
            },

            # Royal Suite at Chambord Castle (owner: antoine)
            {
                "user": "sebastien",
                "place": "chambord_suite",
                "rating": 5,
                "text": "An exceptional suite with a true luxury feel. The atmosphere was elegant and unforgettable.",
            },
            {
                "user": "micael",
                "place": "chambord_suite",
                "rating": 4,
                "text": "Beautiful and impressive suite in a unique setting. Expensive, but clearly a premium experience.",
            },
            {
                "user": "patricia",
                "place": "chambord_suite",
                "rating": 5,
                "text": "Refined, spacious, and memorable. Everything about this suite felt exclusive and luxurious.",
            },

            # Betton Room (owner: benjy)
            {
                "user": "Léa",
                "place": "betton_room",
                "rating": 4,
                "text": "Simple, clean, and practical. A very good option for a short and affordable stay.",
            },
            {
                "user": "brice",
                "place": "betton_room",
                "rating": 3,
                "text": "Basic room, but correct for the price. Good for one night and easy to access.",
            },
            {
                "user": "melissandre",
                "place": "betton_room",
                "rating": 4,
                "text": "Clean and functional room with everything needed for a quick stop near Rennes.",
            },
        ]

        for review_data in reviews_data:
            facade.create_review(
                {
                    "text": review_data["text"],
                    "rating": review_data["rating"],
                    "place_id": places[review_data["place"]].id,
                    "user_id": users[review_data["user"]].id,
                }
            )

        print("\nDemo data inserted successfully.\n")
        print("Shared password for all users: Test1234!\n")
        print("Available accounts:")
        for user_data in users_data:
            print(f"- {user_data['email']}")


if __name__ == "__main__":
    seed_demo_data()
