import { get, update, where } from "../databaseHelper";

export const updateCustomerUserName = async (id, name) => {
  try {
    const snapshot = await get(
      "bookings",
      false,
      where("customerId", "==", id)
    );

    const updatePromises = snapshot.docs.map(async (bookingDoc) =>
      update("bookings", bookingDoc.id, { customerName: name })
    );

    await Promise.all(updatePromises);
    console.log("All usernames updated successfully!");
  } catch (error) {
    console.error("Error updating usernames:", error);
  }
};

export const updateProviderUserName = async (id, name) => {
  try {
    const snapshot = await get(
      "bookings",
      false,
      where("providerId", "==", id)
    );

    const updatePromises = snapshot.docs.map(async (bookingDoc) =>
      update("bookings", bookingDoc.id, { providerName: name })
    );

    await Promise.all(updatePromises);

    const snap = await get(
      "providerServices",
      false,
      where("providerId", "==", id)
    );

    const updateServicePromises = snap.docs.map(async (doc) =>
      update("providerServices", doc.id, { providerName: name })
    );

    await Promise.all(updateServicePromises);
    console.log("All usernames updated successfully!");
  } catch (error) {
    console.error("Error updating usernames:", error);
  }
};

export const updateProviderUserImage = async (id, image) => {
  try {
    const snap = await get(
      "providerServices",
      false,
      where("providerId", "==", id)
    );

    const updateServicePromises = snap.docs.map(async (doc) =>
      update("providerServices", doc.id, { providerImage: image })
    );

    await Promise.all(updateServicePromises);
    console.log("All usernames updated successfully!");
  } catch (error) {
    console.error("Error updating usernames:", error);
  }
};
