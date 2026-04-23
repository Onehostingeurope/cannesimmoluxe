import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Register fonts if needed (using system defaults for now or standard PDF fonts)
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#fcf9f4', // luxury ivory
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
    flexDirection: 'column',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0ede8',
    paddingBottom: 20,
  },
  brand: {
    fontSize: 24,
    color: '#1c1c19',
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 8,
    color: '#705b3b',
    letterSpacing: 4,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  heroImage: {
    width: '100%',
    height: 350,
    marginBottom: 30,
  },
  content: {
    flexDirection: 'row',
    gap: 30,
  },
  mainCol: {
    flex: 2,
  },
  sideCol: {
    flex: 1,
    backgroundColor: '#f6f3ee',
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: '#1c1c19',
    marginBottom: 10,
  },
  location: {
    fontSize: 10,
    color: '#705b3b',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 20,
  },
  description: {
    fontSize: 11,
    lineHeight: 1.6,
    color: '#1c1c19',
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    marginBottom: 30,
  },
  statItem: {
    width: '45%',
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 7,
    textTransform: 'uppercase',
    color: '#1c1c19',
    opacity: 0.5,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    color: '#1c1c19',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: '#f0ede8',
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 8,
    color: '#1c1c19',
    opacity: 0.3,
  }
});

interface PropertyPDFProps {
  property: {
    title: string;
    city: string;
    description_long?: string | null;
    price?: number | null;
    bedrooms?: number | null;
    bathrooms?: number | null;
    surface?: number | null;
    ref_id?: string;
    images: string[];
    garage?: number | null;
    piscine?: boolean;
    air_conditioning?: boolean;
    exposition?: string | null;
    vue?: string | null;
  };
}

export const PropertyPDF = ({ property }: PropertyPDFProps) => {
  const formattedPrice = property.price 
    ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(property.price)
    : 'Price on Request';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.brand}>CANNEIMMO LUXE</Text>
          <Text style={styles.tagline}>Curating the Riviera</Text>
        </View>

        {/* Hero */}
        <Image src={property.images[0]} style={styles.heroImage} />

        <View style={styles.content}>
          <View style={styles.mainCol}>
            <Text style={styles.title}>{property.title}</Text>
            <Text style={styles.location}>{property.city}, French Riviera</Text>
            <Text style={styles.description}>
              {property.description_long || "Discover a world of refined elegance and architectural beauty in this exceptional residence. Perfectly situated to enjoy the best of the Côte d'Azur, this property offers unparalleled luxury and sophistication."}
            </Text>
            
            <View style={styles.statsGrid}>
               <View style={styles.statItem}>
                 <Text style={styles.statLabel}>Bedrooms</Text>
                 <Text style={styles.statValue}>{property.bedrooms || '—'}</Text>
               </View>
               <View style={styles.statItem}>
                 <Text style={styles.statLabel}>Bathrooms</Text>
                 <Text style={styles.statValue}>{property.bathrooms || '—'}</Text>
               </View>
               <View style={styles.statItem}>
                 <Text style={styles.statLabel}>Surface</Text>
                 <Text style={styles.statValue}>{property.surface ? `${property.surface} m²` : '—'}</Text>
               </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Price</Text>
                  <Text style={styles.statValue}>{formattedPrice}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Garage</Text>
                  <Text style={styles.statValue}>{property.garage ? `${property.garage} spaces` : 'None'}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Swimming Pool</Text>
                  <Text style={styles.statValue}>{property.piscine ? 'Yes' : 'No'}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Air Conditioning</Text>
                  <Text style={styles.statValue}>{property.air_conditioning ? 'Yes' : 'No'}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Exposure</Text>
                  <Text style={styles.statValue}>{property.exposition || '—'}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>View</Text>
                  <Text style={styles.statValue}>{property.vue || '—'}</Text>
                </View>
             </View>
          </View>

          <View style={styles.sideCol}>
            <Text style={[styles.statLabel, { marginBottom: 10 }]}>Contact Our Concierge</Text>
            <Text style={{ fontSize: 10, color: '#1c1c19', marginBottom: 20 }}>
              45 Boulevard de la Croisette{"\n"}
              06400 Cannes, France{"\n"}
              +33 (0)4 93 00 00 00
            </Text>
            <Text style={[styles.statLabel, { marginBottom: 10 }]}>Property Ref</Text>
            <Text style={{ fontSize: 12, color: '#705b3b' }}>{property.ref_id || 'REF-LUXE'}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>CANNEIMMO LUXE — CONFIDENTIAL PROPERTY SHEET</Text>
          <Text style={styles.footerText}>WWW.CANNEIMMOLUXE.COM</Text>
        </View>
      </Page>
    </Document>
  );
};
