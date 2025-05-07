import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import SwipeableItem from "./Swipeable";
import styles from "./styles";
import { fetchData } from "./api";
import Icon from "react-native-vector-icons/Fontisto";
import OfflineNotice from "./Offline";

// en esta parte {navigation} se usa para mover a otra pantalla
// (en este caso no la estoy usando, pero esta ahi por si la quiero usar)

export default function Films({ navigation }) {
  const [films, setFilms] = useState([]); // contiene toda la lista de peliculas extraidas de el API
  const [loading, setLoading] = useState(true); //Si la aplicación está actualmente cargando datos
  //  (comienza como verdadero).
  const [error, setError] = useState(null); // contiene cualquier mensaje de error si falla
  //  la recuperacion de datos.
  const [searchText, setSearchText] = useState(""); // contiene lo que el usuario
  //  escribe en la barra de busqueda
  const [removingIds, setRemovingIds] = useState([]); // mantiene un registro de el nombre de las
  // peliculas que estan

  // Se ejecuta una vez al cargar la pantalla.
  // Llama a fetchData("films") para obtener todos los datos de las películas.
  // Si funciona, guarda las películas en el directorio películas.
  // Si falla, guarda el error.
  // En cualquier caso, establece la carga como "false" una vez finalizada.

  useEffect(() => {
    fetchData("films")
      .then((data) => {
        console.log("Fetched films:", data);
        setFilms(data);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  // Cada vez que el usuario cambia el texto de búsqueda, este código restablece removedIds.
  // De esta forma, cada nueva búsqueda comienza desde cero, sin eliminar elementos.

  useEffect(() => {
    setRemovingIds([]);
  }, [searchText]);

  // Si el cuadro de búsqueda está vacío -> no hay resultados ([]).
  // Si el usuario escribió algo:
  // Se filtran las películas solo con el título que contiene el texto de búsqueda
  // (sin distinguir entre mayúsculas y minúsculas).
  // Se filtran además las películas que el usuario ha eliminado (las que se encuentran en removedIds).

  // De esta forma, solo se muestran las películas que:
  // Coinciden con el texto de búsqueda.
  // No se han eliminado.

  const filteredList =
    searchText.trim() === ""
      ? []
      : films
          .filter((film) =>
            film.properties.title
              .toLowerCase()
              .includes(searchText.toLowerCase())
          )
          .filter((film) => !removingIds.includes(film.uid));

  // Cuando el usuario elimina una película (deslizándola), esta función:

  // Añade el UID de la película a removedIds.
  // Esto la hace desaparecer de filteredList (debido al segundo .filter() mencionado anteriormente).

  const handleRemoveItem = (uid) => {
    if (!removingIds.includes(uid)) {
      setRemovingIds((prev) => [...prev, uid]);
    }
  };

  // Si los datos siguen cargándose -> se muestra un indicador.
  // Si hubo un error -> se muestra el mensaje de error.

  if (loading) return <ActivityIndicator size="large" color="green" />;
  if (error) return <Text>Error: {error.message}</Text>;

  // envuelve todo el contenido (<View style={styles.container}>) en un
  // contenedor de vista con estilos personalizados.

  //Muestra un gran ícono del cine. (<Icon name="film" size={100} color="black" />)
  // se tiene que hacer un expo install icon para que funcione el icono

  // Muestra el cuadro de búsqueda.
  // Cuando el usuario escribe -> actualiza searchText -> actualiza filteredList.

  // Permite desplazarse por la lista. Recorre cada película de la lista filtrada.
  // (<ScrollView style={{ marginTop: 20 }}>
  // {filteredList.map((item) => ())

  // Para cada película:

  // Se muestra como un elemento deslizable.
  // Si el usuario desliza la película y el texto de búsqueda coincide
  // exactamente con el título, la elimina.
  // Esto garantiza que el usuario solo pueda eliminar una película si escribe el título exacto.
  // (SwipeableItem) y (handleRemoveItem-> elimina la pelicula )

  //Si no hay resultados → muestra el mensaje "No se encontraron películas coincidentes".
  //{filteredList.length === 0 && (
  //<Text style={{ textAlign: "center", marginTop: 20 }}>
  //No matching films found.
  //</Text>)}
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name="film" size={100} color="black" />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Search Films..."
        value={searchText}
        onChangeText={setSearchText}
      />

      <OfflineNotice />

      <ScrollView style={{ marginTop: 20 }}>
        {filteredList.map((item) => (
          <SwipeableItem
            key={item.uid}
            uid={item.uid}
            name={item.properties.title}
            onSwipe={() => {
              if (
                item.properties.title.toLowerCase().trim() ===
                searchText.toLowerCase().trim()
              ) {
                handleRemoveItem(item.uid);
              }
            }}
          />
        ))}

        {filteredList.length === 0 && (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No matching films found.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
