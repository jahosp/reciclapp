import numpy as np
from sklearn import cluster

def buscar_zones_conflictives(values,lat_long, K = 2):
    """Hago Kmeans para metrica y para coordenadas"""
    k_means_values = cluster.KMeans(n_clusters=K)
    k_means_latlong = cluster.KMeans(n_clusters=K)
    k_means_values.fit(values)
    k_means_latlong.fit(lat_long)

    """Saco los centros y el valor de cluster por punto"""
    cluster_values = k_means_values.labels_
    cluster_latlong = k_means_latlong.labels_
    centersValues = k_means_values.cluster_centers_
    centersLongLat = k_means_latlong.cluster_centers_

    """Saco indice metrica con menor valor"""
    minArgValues = np.argmin(np.sum(centersValues,axis=1))

    """Miro los valores unicos del indice anterior en el cluster de coordenadas"""
    LatLong_minValues = cluster_latlong[np.where(cluster_values==minArgValues)]
    minValues = lat_long[np.where(cluster_values==minArgValues)]
    unique,counts = np.unique(LatLong_minValues, return_counts=True)

    if unique.shape[0] == 1:
        print("Els usuaris amb menor participació estan a la mateixa zona")
        print("Al voltant de: "+ str(np.mean(minValues,axis=0)))
        print("Numero de usuaris: "+ str(counts[0]))

