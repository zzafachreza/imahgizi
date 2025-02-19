import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, StyleSheet, Alert, } from 'react-native'
import React, { useRef, useState } from 'react'
import colors from '../../../utils/colors'
import { Calendar, LeftArrow } from '../../../assets/img'
import DatePicker from 'react-native-date-picker';
import Modal from "react-native-modal";
import axios from 'axios';
import { URLIbuHamilKEK } from '../../../utils/storedata/storedata';
import { Picker } from '@react-native-picker/picker';

export default function FromIbuHamilKEK({ navigation }) {
  const [form, setForm] = useState({
    namaibu: '',
    nik: '',
    usiaibu: '',
    alamat: {
      kecamatan: '',
      desa: '',
    },
    usiakehamilan: '',
    hasilpengukuranlila: '',
    waktupendataan: '',
  });

  // ALAMAT OPTIONS
  const [selectedKecamatan, setSelectedKecamatan] = useState('');
  const [selectedDesa, setSelectedDesa] = useState('');

  const kecamatanOptions = [
    { label: 'Bantarkalong', value: 'bantarkalong' },
    { label: 'Bojongasih', value: 'bojongasih' },
    // Add more kecamatan options as needed
  ];

  const desaOptions = {
    bantarkalong: [
      { label: 'Hegarwangi', value: 'hegarwangi' },
      // Add more desa options for Bantarkalong as needed
    ],
    bojongasih: [
      { label: 'DesaA', value: 'desaA' },
      // Add more desa options for Bojongasih as needed
    ],
    // Add more entries for other kecamatan as needed
  };


  const [selectedDateText, setSelectedDateText] = useState('Waktu Pendataan'); // Tambah state untuk teks tanggal terpilih
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDateTextColor, setSelectedDateTextColor] = useState('gray'); // Warna teks awal adalah abu-abu

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const handleDateChange = date => {
    // Hanya pebarui form jika tanggal yang dipilih adalah tanggal saat ini atau masa lalu
    setForm({ ...form, waktupendataan: date });
    setSelectedDateText(
      `${date.getDate()} - ${date.getMonth() + 1} - ${date.getFullYear()}`
    );
    setSelectedDateTextColor('black');

  };


  const handleSaveDate = () => {
    setShowDatePicker(false); // Menutup modal
  };


  const PickerDate = () => {
    // Set tanggal awal di modal kalender sebagai tanggal saat ini
    const initialDate = form.waktupendataan || new Date();

    return (
      <TouchableOpacity onPress={toggleDatePicker}>
        <Image style={{ height: 20, width: 20, tintColor: colors.primary, bottom: 5 }} source={Calendar} />
        <Modal isVisible={showDatePicker}>
          <View style={styles.datePickerContainer}>
            <Text style={{ fontFamily: 'Poppins-Regular', marginTop: 10 }}>Pilih Tanggal Pendataan</Text>
            <DatePicker
              style={{ alignSelf: 'center', marginTop: 10 }}
              date={initialDate}
              mode="date"
              textColor='black'
              onDateChange={handleDateChange}
            />
            <TouchableOpacity onPress={toggleDatePicker}>
              <TouchableOpacity onPress={handleSaveDate} style={styles.button}>
                <Text style={styles.buttonText}>Simpan</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </Modal>
      </TouchableOpacity>
    );
  };


  const HandleSimpan = () => {
    if ((form.namaibu.length == 0) | (form.nik.length == 0) | (form.usiaibu.length == 0) | (form.alamat.length == 0) | (form.usiakehamilan.length == 0) | (form.hasilpengukuranlila.length == 0)) {
      alert("Mohon Isi Semua Feild")
    } else {
      console.log(form);

      axios
        .post(URLIbuHamilKEK, form)
        .then(response => {
          console.log(response.data);

          if (response.data.status == 200) {
            console.log(response.data);
            alert("Data Berhasil di Simpan!");
            navigation.replace("HomeScreen");
          } else {
            alert("Terjadi Kesalahan");
          }
        })
        .catch(error => {
          console.error(error);
        })

    }
  }

  const handleBack = () => {
    navigation.goBack()
  }

  return (
    <>
      <View style={{ flex: 1, backgroundColor: 'white' }}>

        <View style={{ padding: 10, backgroundColor: colors.primary, }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>

            <View>
              <TouchableOpacity onPress={handleBack}>
                <Image source={LeftArrow} style={{ tintColor: 'white', height: 25, width: 25 }} />
              </TouchableOpacity>
            </View>

            <View style={{ left: -110 }}>
              <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 15, color: 'white' }}>Ibu Hamil KEK</Text>
            </View>
          </View>
        </View>

        <ScrollView>
          <View style={{ padding: 10, }}>

            <View style={{ marginTop: '10%' }}>

              {/* NAMA IBU */}
              <Text style={{ fontFamily: 'Poppins-SemiBold', left: 2 }}>Nama Ibu</Text>
              <TextInput style={{
                backgroundColor: '#f5f5f5', borderRadius: 5, borderWidth: 1, height: 40, fontFamily: 'Poppins-Regular', fontSize: 12, color: 'black',
                paddingRight: 10, paddingLeft: 10,
              }} placeholder='Nama Ibu' placeholderTextColor='gray' value={form.namaibu}
                onChangeText={value => setForm({ ...form, namaibu: value })}
              />


              {/* NIK */}
              <Text style={{ fontFamily: 'Poppins-SemiBold', left: 2, marginTop: 20 }}>NIK</Text>
              <TextInput style={{
                backgroundColor: '#f5f5f5', borderRadius: 5, borderWidth: 1, height: 40, fontFamily: 'Poppins-Regular', fontSize: 12, color: 'black',
                paddingRight: 10, paddingLeft: 10,
              }} placeholder='NIK' placeholderTextColor='gray' keyboardType='numeric' value={form.nik}
                onChangeText={value => setForm({ ...form, nik: value })} />


              {/* USIA IBU */}
              <Text style={{ fontFamily: 'Poppins-SemiBold', left: 2, marginTop: 20 }}>Usia Ibu</Text>
              <TextInput style={{
                backgroundColor: '#f5f5f5', borderRadius: 5, borderWidth: 1, height: 40, fontFamily: 'Poppins-Regular', fontSize: 12, color: 'black',
                paddingRight: 10, paddingLeft: 10,
              }} placeholder='Usia Ibu' placeholderTextColor='gray' keyboardType='numeric' value={form.usiaibu}
                onChangeText={value => setForm({ ...form, usiaibu: value })} />


              {/*ALAMAT*/}
              <Text style={{ fontFamily: 'Poppins-SemiBold', left: 2, marginTop: 20 }}>Alamat</Text>

              {/* KECAMATAN */}
              {/* KECAMATAN */}
              <Picker
                prompt="Pilih Kecamatan..."
                selectedValue={selectedKecamatan}
                style={styles.placehorder}
                onValueChange={(value) => setSelectedKecamatan(value)}
              >
                {kecamatanOptions.map((kecamatan) => (
                  <Picker.Item key={kecamatan.value} label={kecamatan.label} value={kecamatan.value} />
                ))}
              </Picker>

              {/* DESA */}
              {selectedKecamatan && (
                <Picker
                  prompt="Pilih Desa..."
                  selectedValue={selectedDesa}
                  style={styles.placehorder}
                  onValueChange={(value) => setSelectedDesa(value)}
                >
                  {desaOptions[selectedKecamatan].map((desa) => (
                    <Picker.Item key={desa.value} label={desa.label} value={desa.value} />
                  ))}
                </Picker>
              )}


              {/*USIA KEHAMILAN*/}
              <Text style={{ fontFamily: 'Poppins-SemiBold', left: 2, marginTop: 20 }}>Usia Kehamilan</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', borderColor: 'gray', borderWidth: 1, borderRadius: 5, backgroundColor: '#f5f5f5' }}>
                <TextInput
                  style={{
                    flex: 1,
                    backgroundColor: '#f5f5f5',
                    fontSize: 12,
                    color: 'black',
                    paddingLeft: 10,
                    height: 40,
                    fontFamily: 'Poppins-Regular',
                    borderRadius: 5,
                  }}
                  placeholder="Usia Kehamilan"
                  placeholderTextColor="gray"
                  keyboardType="numeric"
                  value={form.usiakehamilan}
                  onChangeText={value => setForm({ ...form, usiakehamilan: value })}
                />
                <Text style={{ left: -10, fontFamily: 'Poppins-Regular', fontSize: 12, color: 'black' }}>
                  Berapa Minggu
                </Text>
              </View>

              {/*HASIL PENGUKURAN*/}
              <Text style={{ fontFamily: 'Poppins-SemiBold', left: 2, marginTop: 20 }}>Hasil Pengukuran LILA</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', borderColor: 'gray', borderWidth: 1, borderRadius: 5, backgroundColor: '#f5f5f5' }}>
                <TextInput
                  style={{
                    flex: 1,
                    backgroundColor: '#f5f5f5',
                    fontSize: 12,
                    color: 'black',
                    paddingLeft: 10,
                    height: 40,
                    fontFamily: 'Poppins-Regular',
                    borderRadius: 5,
                  }}
                  placeholder="Hasil Pengukuran LILA"
                  placeholderTextColor="gray"
                  keyboardType="numeric"
                  value={form.hasilpengukuranlila}
                  onChangeText={value => setForm({ ...form, hasilpengukuranlila: value })}
                />
                <Text style={{ left: -10, fontFamily: 'Poppins-Regular', fontSize: 12, color: 'black' }}>
                  Berapa cm
                </Text>
              </View>

              {/*WAKTU PENDAFTARAN*/}
              <Text style={{ fontFamily: 'Poppins-SemiBold', left: 2, marginTop: 20 }}>Waktu Pendataan</Text>
              <View style={{ flexDirection: 'row', borderColor: 'gray', borderWidth: 1, borderRadius: 5, backgroundColor: '#f5f5f5', height: 40, justifyContent: 'space-between' }}>
                <View>

                  <Text style={{
                    textAlign: 'left',
                    fontFamily: 'Poppins-Regular',
                    fontSize: 12,
                    bottom: 0,
                    top: 0,
                    left: 10,
                    marginTop: 10,
                    color: selectedDateTextColor
                  }}>
                    {selectedDateText}
                  </Text>

                </View>


                <View style={{ top: 15, left: -10 }}>
                  <PickerDate />
                </View>
              </View>
            </View>

            {/* SIMPAN */}
            <View style={{ marginTop: 20 }}>
              <TouchableOpacity onPress={HandleSimpan} style={{ padding: 10, backgroundColor: colors.primary, borderRadius: 5, }}>
                <Text style={{ color: 'white', fontFamily: 'Poppins-SemiBold', fontSize: 15, textAlign: 'center' }}>Simpan</Text>
              </TouchableOpacity>

            </View>

          </View>
        </ScrollView>
      </View>
    </>
  )
}


const styles = StyleSheet.create({
  placehorder: {
    height: 40,
    backgroundColor: '#dedede',
    borderRadius: 10,
    color: 'black',
    paddingRight: 10,
    paddingLeft: 10,
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
  },
  nameholder: {
    height: 40,
    backgroundColor: '#dedede',
    borderRadius: 10,
    color: 'black',
    paddingRight: 10,
    paddingLeft: 10,
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
  },

  datePickerContainer: {
    height: 280,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,



  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: colors.success,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'white',
    height: 40,
    width: 100,


  },
  buttonText: {
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    fontSize: 12

  },

})