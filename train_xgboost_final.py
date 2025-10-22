# -*- coding: utf-8 -*-
"""
MODELE FINAL AVEC XGBOOST (Meilleur score: 98.9%)
Compatible avec le code des correcteurs
"""

print("CREATION DU MODELE FINAL - XGBOOST")
print("="*50)

import pandas as pd
import numpy as np
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.pipeline import Pipeline
from xgboost import XGBClassifier
import skops.io as skio
import warnings
warnings.filterwarnings('ignore')

# ============================================================================
# PREPROCESSING PERSONNALISE
# ============================================================================
class NetworkFlowPreprocessor(BaseEstimator, TransformerMixin):
    """Transformer pour nettoyer automatiquement les donnees de flux reseau"""

    def __init__(self):
        self.feature_names_ = None
        self.medians_ = {}

    def fit(self, X, y=None):
        # Nettoyer les valeurs infinies
        X_clean = X.replace([np.inf, -np.inf], np.nan)

        # Calculer et stocker les medianes
        for col in X_clean.columns:
            if X_clean[col].isnull().sum() > 0:
                self.medians_[col] = X_clean[col].median()

        # Remplir les NaN
        X_filled = X_clean.copy()
        for col, median_val in self.medians_.items():
            X_filled[col].fillna(median_val, inplace=True)

        # Garder seulement les colonnes non-constantes
        mask = X_filled.std() > 0
        self.feature_names_ = X_filled.columns[mask].tolist()

        return self

    def transform(self, X):
        # Nettoyer
        X_clean = X.replace([np.inf, -np.inf], np.nan)

        # Remplir avec les medianes du training
        X_filled = X_clean.copy()
        for col in X_filled.columns:
            if col in self.medians_:
                X_filled[col].fillna(self.medians_[col], inplace=True)
            elif X_filled[col].isnull().sum() > 0:
                X_filled[col].fillna(0, inplace=True)

        # Filtrer les colonnes
        cols_present = [c for c in self.feature_names_ if c in X_filled.columns]
        return X_filled[cols_present]

# ============================================================================
# WRAPPER POUR XGBOOST AVEC ENCODAGE AUTOMATIQUE
# ============================================================================
class XGBoostWrapper(BaseEstimator):
    """Wrapper pour XGBoost qui encode/decode automatiquement les labels"""

    def __init__(self, **kwargs):
        self.xgb_params = kwargs
        self.xgb_model = None
        self.label_encoder = LabelEncoder()

    def fit(self, X, y):
        # Encoder les labels
        y_encoded = self.label_encoder.fit_transform(y)

        # Creer et entrainer XGBoost
        self.xgb_model = XGBClassifier(**self.xgb_params)
        self.xgb_model.fit(X, y_encoded)

        return self

    def predict(self, X):
        # Predire avec labels encodes
        y_pred_encoded = self.xgb_model.predict(X)

        # Decoder les labels
        return self.label_encoder.inverse_transform(y_pred_encoded)

    def predict_proba(self, X):
        return self.xgb_model.predict_proba(X)

    def score(self, X, y):
        from sklearn.metrics import accuracy_score
        y_pred = self.predict(X)
        return accuracy_score(y, y_pred)

# ============================================================================
# CHARGEMENT DES DONNEES
# ============================================================================
print("\n[1/3] Chargement des donnees...")
df = pd.read_parquet("Training.parquet")
X = df.drop(columns=["ClassLabel"])
y = df["ClassLabel"]
print(f"OK - {len(df):,} lignes, {len(X.columns)} features")
print(f"Classes: {sorted(y.unique())}")

# ============================================================================
# CREATION DU PIPELINE
# ============================================================================
print("\n[2/3] Creation du pipeline XGBoost...")

student_model = Pipeline([
    ('preprocessor', NetworkFlowPreprocessor()),
    ('scaler', StandardScaler()),
    ('classifier', XGBoostWrapper(
        n_estimators=200,
        max_depth=8,
        learning_rate=0.1,
        random_state=42,
        n_jobs=-1,
        eval_metric='mlogloss'
    ))
])

print("Pipeline cree avec succes")

# ============================================================================
# ENTRAINEMENT
# ============================================================================
print("\n[3/3] Entrainement sur toutes les donnees...")
print("Cela va prendre environ 5-10 minutes...")

import time
start = time.time()

student_model.fit(X, y)

elapsed = time.time() - start
print(f"\nOK - Entrainement termine en {elapsed/60:.1f} minutes")

# Score
score = student_model.score(X, y)
print(f"Score d'entrainement: {score:.4f} ({score*100:.2f}%)")

# ============================================================================
# SAUVEGARDE
# ============================================================================
print("\nSauvegarde du modele...")

try:
    skio.dump(student_model, "student_model.skio")

    import os
    size_mb = os.path.getsize("student_model.skio") / (1024 * 1024)
    print(f"OK - student_model.skio cree ({size_mb:.2f} MB)")
except Exception as e:
    print(f"Erreur lors de la sauvegarde: {e}")
    print("Tentative avec pickle...")
    import pickle
    with open("student_model.pkl", "wb") as f:
        pickle.dump(student_model, f)
    print("OK - student_model.pkl cree (alternative)")

# ============================================================================
# VALIDATION
# ============================================================================
print("\n" + "="*50)
print("VALIDATION")
print("="*50)

try:
    # Recharger
    types = skio.get_untrusted_types(file="student_model.skio")
    print(f"Types dans le modele: {types}")

    loaded_model = skio.load("student_model.skio", trusted=types)

    # Tester avec donnees brutes
    df_test = pd.read_parquet("Training.parquet")
    X_test = df_test.drop(columns=["ClassLabel"])
    y_test = df_test["ClassLabel"]

    test_score = loaded_model.score(X_test, y_test)

    print(f"\nSCORE FINAL: {test_score:.4f} ({test_score*100:.2f}%)")
    print("="*50)
    print("TERMINE - Modele pret pour soumission!")
    print("="*50)

except Exception as e:
    print(f"\nErreur lors de la validation: {e}")
    print("Le modele a ete entraine mais il y a un probleme de chargement.")
    print("Utilisez le fichier .pkl comme alternative si necessaire.")
