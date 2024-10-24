import * as THREE from 'three';
import React, { useContext, useEffect } from 'react';
import { useGLTF } from '@react-three/drei/native';
import { GLTF } from 'three-stdlib';
import { FirebaseContext } from "../services/FirebaseData";

type GLTFResult = GLTF & {
  nodes: {
    Tree001: THREE.Mesh;
    Tree002: THREE.Mesh;
    Tree003: THREE.Mesh;
    Tree004: THREE.Mesh;
    Tree005: THREE.Mesh;
    Tree006: THREE.Mesh;
    Tree007: THREE.Mesh;
    Tree008: THREE.Mesh;
    Tree009: THREE.Mesh;
    Tree010: THREE.Mesh;
    Tree011: THREE.Mesh;
    Tree012: THREE.Mesh;
    Tree013: THREE.Mesh;
    Tree014: THREE.Mesh;
    Tree015: THREE.Mesh;
    Tree016: THREE.Mesh;
    Tree017: THREE.Mesh;
    Tree018: THREE.Mesh;
    Tree019: THREE.Mesh;
    Tree020: THREE.Mesh;
    Tree021: THREE.Mesh;
    Tree022: THREE.Mesh;
    Tree023: THREE.Mesh;
    Tree024: THREE.Mesh;
    Tree025: THREE.Mesh;
    Tree026: THREE.Mesh;
    Tree027: THREE.Mesh;
    Tree: THREE.Mesh;
  };
  materials: {
    Mat_tree: THREE.MeshStandardMaterial;
  };
};

export default function Model(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF(require('../../assets/Garden.glb')) as GLTFResult;
  const { GetTreesPlanted, treesPlanted } = useContext(FirebaseContext);
  
  useEffect(() => {
    GetTreesPlanted();
  }, []);

  

  // Create an array of tree node names in the correct order
  const treeNodes = [
    nodes.Tree001,
    nodes.Tree002,
    nodes.Tree003,
    nodes.Tree004,
    nodes.Tree005,
    nodes.Tree006,
    nodes.Tree007,
    nodes.Tree008,
    nodes.Tree009,
    nodes.Tree010,
    nodes.Tree011,
    nodes.Tree012,
    nodes.Tree013,
    nodes.Tree014,
    nodes.Tree015,
    nodes.Tree016,
    nodes.Tree017,
    nodes.Tree018,
    nodes.Tree019,
    nodes.Tree020,
    nodes.Tree021,
    nodes.Tree022,
    nodes.Tree023,
    nodes.Tree024,
    nodes.Tree025,
    nodes.Tree026,
    nodes.Tree027,
  ];

  return (
    <group {...props} dispose={null} scale={0.6} position = {[5,1,-3]} >
      {treesPlanted > 0 ? (
        // Render trees based on the value of treesPlanted
        treeNodes.slice(0, treesPlanted).map((tree, index) => (
          <mesh
            key={index}
            castShadow
            receiveShadow
            geometry={tree.geometry}
            material={materials.Mat_tree}
            position={tree.position}
          />
        ))
      ) : (
       null
      )}
    </group>
  );
}

useGLTF.preload(require('../../assets/Garden.glb'));
