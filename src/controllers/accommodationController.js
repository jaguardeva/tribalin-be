import db from "../../config/database.js";

export const searchAccommodations = (req, res) => {
  const { type } = req.query; // Mengambil parameter 'type' dari URL
  
  if (!type) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Type is required",
    });
  }

  const query = `
    SELECT accommodations.*, 
           specification.name AS specification_name, 
           specification.count AS specification_count
    FROM accommodations
    LEFT JOIN specification ON accommodations.id = specification.accommodation_id
    WHERE accommodations.type = ?
  `;
  
  db.query(query, [type], (err, datas) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal Server Error",
        error: err.message,
      });
    }

    if (datas.length === 0) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "No accommodations found for this type.",
      });
    }

    // Proses response untuk mengelompokkan spesifikasi dalam array
    const accommodations = datas.reduce((acc, accommodation) => {
      let accommodationData = acc.find(a => a.id === accommodation.id);
      
      // Jika accommodation belum ada dalam array, tambahkan
      if (!accommodationData) {
        accommodationData = {
          ...accommodation,
          specifications: [] // Menambahkan array spesifikasi
        };
        acc.push(accommodationData);
      }

      // Jika spesifikasi ada, tambahkan nama dan count ke accommodation
      if (accommodation.specification_name) {
        accommodationData.specifications.push({
          name: accommodation.specification_name,
          count: accommodation.specification_count
        });
      }

      return acc;
    }, []);

    // Remove specification_name and specification_count from the result
    accommodations.forEach(accommodation => {
      delete accommodation.specification_name;
      delete accommodation.specification_count;
    });

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Accommodations and specifications retrieved successfully.",
      data: accommodations,
    });
  });
};

export const getAllAccommodations = (req, res) => {
  const query = `
    SELECT accommodations.*, 
           specification.name AS specification_name, 
           specification.count AS specification_count
    FROM accommodations
    LEFT JOIN specification ON accommodations.id = specification.accommodation_id
  `;

  db.query(query, (err, datas) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal Server Error",
        error: err.message,
      });
    }

    if (datas.length === 0) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "No accommodations found.",
      });
    }

    // Proses response untuk mengelompokkan spesifikasi dalam array
    const accommodations = datas.reduce((acc, accommodation) => {
      let accommodationData = acc.find(a => a.id === accommodation.id);
      
      // Jika accommodation belum ada dalam array, tambahkan
      if (!accommodationData) {
        accommodationData = {
          ...accommodation,
          specifications: [] // Memulai array spesifikasi
        };
        acc.push(accommodationData);
      }

      // Jika spesifikasi ada, tambahkan nama dan count ke accommodation
      if (accommodation.specification_name) {
        accommodationData.specifications.push({
          name: accommodation.specification_name,
          count: accommodation.specification_count
        });
      }

      return acc;
    }, []);

    // Remove specification_name from the result
    accommodations.forEach(accommodation => {
      delete accommodation.specification_name;
      delete accommodation.specification_count;
    });

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Accommodations and specifications retrieved successfully.",
      data: accommodations,
    });
  });
};

export const getAccommodationById = (req, res) => {
  const id = req.params.id;
  const query = `
    SELECT accommodations.*, 
           specification.name AS specification_name, 
           specification.count AS specification_count
    FROM accommodations
    LEFT JOIN specification ON accommodations.id = specification.accommodation_id
    WHERE accommodations.id = ?
  `;

  db.query(query, [id], (err, datas) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal Server Error",
        error: err.message,
      });
    }

    if (datas.length === 0) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Accommodation not found",
      });
    }

    // Proses response untuk mengelompokkan spesifikasi dalam array
    const accommodation = datas.reduce((acc, accommodation) => {
      if (!acc) {
        acc = {
          ...accommodation,
          specifications: [] // Menambahkan array spesifikasi
        };
      }

      if (accommodation.specification_name) {
        acc.specifications.push({
          name: accommodation.specification_name,
          count: accommodation.specification_count
        });
      }

      return acc;
    }, null);

    // Remove specification_name from the result
    if (accommodation) {
      delete accommodation.specification_name;
      delete accommodation.specification_count;
    }

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Accommodation and specifications retrieved successfully.",
      data: accommodation,
    });
  });
};


export const createAccommodation = (req, res) => {
  const { name, description, price, place, type, image_url } = req.body;

  // Validasi input
  if (!name || !description || !price || !place || !type) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "All fields (name, description, price, place, type) are required",
    });
  }

  // Query untuk memasukkan data dengan image_url dan type
  const query =
    "INSERT INTO accommodations (name, description, price, place, type, image_url) VALUES (?, ?, ?, ?, ?, ?)";
  const values = [name, description, price, place, type, image_url || null]; // image_url default to null if not provided

  db.query(query, values, (err, datas) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal Server Error",
        error: err.message,
      });
    }

    // Kembalikan data yang dimasukkan, termasuk type dan image_url
    res.status(201).json({
      status: 201,
      success: true,
      message: "Accommodation created successfully",
      data: {
        id: datas.insertId, // ID yang baru dimasukkan oleh database
        name,
        description,
        price,
        place,
        type,
        image_url: image_url || null, // return image_url in response, or null if not provided
      },
    });
  });
};

export const editAccommodationById = (req, res) => {
  const { name, description, price, place, type, image_url } = req.body;
  const id = req.params.id;

  // Membuat array untuk nilai yang akan diupdate
  const fieldsToUpdate = [];
  const values = [];

  // Menambahkan field ke array jika field tersebut ada di request body
  if (name) {
    fieldsToUpdate.push("name = ?");
    values.push(name);
  }
  if (description) {
    fieldsToUpdate.push("description = ?");
    values.push(description);
  }
  if (price) {
    fieldsToUpdate.push("price = ?");
    values.push(price);
  }
  if (place) {
    fieldsToUpdate.push("place = ?");
    values.push(place);
  }
  if (type) {
    fieldsToUpdate.push("type = ?");
    values.push(type);
  }
  if (image_url) {
    fieldsToUpdate.push("image_url = ?");
    values.push(image_url);
  }

  // Jika tidak ada field yang diberikan, kirimkan pesan error
  if (fieldsToUpdate.length === 0) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "No fields to update provided",
    });
  }

  // Menambahkan ID di akhir values untuk kondisi WHERE
  values.push(id);

  // Membuat query UPDATE dinamis
  const query = `UPDATE accommodations SET ${fieldsToUpdate.join(", ")} WHERE id = ?`;

  db.query(query, values, (err, datas) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal Server Error",
        error: err.message,
      });
    }

    // Setelah update, query untuk menampilkan data terbaru
    const getUpdatedQuery = `SELECT * FROM accommodations WHERE id = ?`;

    db.query(getUpdatedQuery, [id], (err, updatedData) => {
      if (err) {
        return res.status(500).json({
          status: 500,
          success: false,
          message: "Internal Server Error",
          error: err.message,
        });
      }

      if (updatedData.length === 0) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: "Accommodation not found",
        });
      }

      res.status(200).json({
        status: 200,
        success: true,
        message: "Accommodation updated successfully",
        data: updatedData[0], // Menampilkan data yang baru diperbarui
      });
    });
  });
};

export const deleteAccommodationById = (req, res) => {
  const id = req.params.id;

  const query = `DELETE FROM accommodations WHERE id = ${id}`;

  db.query(query, (err, datas) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal Server Error",
        error: err.message,
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: "Delete accommodation successfully",
    });
  });
};


export const createSpecification = (req, res) => {
  const { name, count } = req.body;
  const accommodationIdFromUrl = req.params.id; // Mengambil accommodation_id dari URL
  const createdAt = new Date();

  // Validasi apakah accommodation_id ada di tabel accommodations
  const checkQuery = "SELECT id FROM accommodations WHERE id = ?";

  db.query(checkQuery, [accommodationIdFromUrl], (err, results) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal Server Error",
        error: err.message,
      });
    }

    // Jika accommodation_id tidak ada di tabel accommodations
    if (results.length === 0) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Accommodation not found",
      });
    }

    // Jika validasi lolos, tambahkan data ke tabel specification
    const insertQuery =
      "INSERT INTO specification (name, count, accommodation_id, created_at) VALUES (?, ?, ?, ?)";
    const values = [name, count, accommodationIdFromUrl, createdAt];

    db.query(insertQuery, values, (err, result) => {
      if (err) {
        return res.status(500).json({
          status: 500,
          success: false,
          message: "Internal Server Error",
          error: err.message,
        });
      }

      // Kembalikan data specification yang baru dimasukkan
      res.status(201).json({
        status: 201,
        success: true,
        message: "Specification created successfully",
        data: {
          id: result.insertId,
          name,
          count,
          accommodation_id: accommodationIdFromUrl,
          created_at: createdAt,
        },
      });
    });
  });
};

export const updateSpecification = (req, res) => {
  const { name, count } = req.body;
  const specificationId = req.params.id; // Ambil id spesifikasi dari URL
  const updatedAt = new Date(); // Waktu pembaruan

  // Validasi apakah specification_id ada di tabel specification
  const checkQuery = "SELECT id, accommodation_id FROM specification WHERE id = ?";

  db.query(checkQuery, [specificationId], (err, results) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal Server Error",
        error: err.message,
      });
    }

    // Jika specification_id tidak ditemukan
    if (results.length === 0) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Specification not found",
      });
    }

    const accommodationIdFromSpecification = results[0].accommodation_id;

    // Update query berdasarkan data yang diberikan (name, count)
    let updateQuery = "UPDATE specification SET updated_at = ? ";
    let updateValues = [updatedAt]; // Menyimpan nilai-nilai untuk query update

    // Hanya update field yang ada di body request
    if (name) {
      updateQuery += ", name = ?";
      updateValues.push(name);
    }

    if (count) {
      updateQuery += ", count = ?";
      updateValues.push(count);
    }

    // Tambahkan kondisi WHERE dengan specification_id
    updateQuery += " WHERE id = ?";
    updateValues.push(specificationId);

    // Melakukan update data specification
    db.query(updateQuery, updateValues, (err, result) => {
      if (err) {
        return res.status(500).json({
          status: 500,
          success: false,
          message: "Internal Server Error",
          error: err.message,
        });
      }

      // Kembalikan data specification yang sudah diupdate
      res.status(200).json({
        status: 200,
        success: true,
        message: "Specification updated successfully",
        data: {
          id: specificationId,
          name: name || results[0].name, // Menampilkan name yang sudah diperbarui atau yang lama
          count: count || results[0].count, // Menampilkan count yang sudah diperbarui atau yang lama
          accommodation_id: accommodationIdFromSpecification,
          updated_at: updatedAt,
        },
      });
    });
  });
};

export const deleteSpecification = (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM specification WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal Server Error",
        error: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Specification not found",
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: "Specification deleted successfully",
    });
  });
};

